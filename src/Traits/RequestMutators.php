<?php

namespace FormForge\Traits;

use Carbon\Carbon;
use Illuminate\Support\Str;

trait RequestMutators
{
    public function setAttribute(string $property, $value): void
    {
        if (empty($this->fillable) || in_array($property, $this->fillable)) {
            $this->attributes[$property] = $this->reformatInput($property, $value);
        }
    }

    /**
     * Check and fix request data for date and float values.
     *
     * @param  mixed  $input
     */
    protected function reformatInput(string $property, $input)
    {
        if (is_string($input) && self::isDate($input)) {
            if (Str::contains($property, '_from') || Str::contains($property, '_to')) {
                $input = self::formatDateSpan($property, $input);
            }
        } elseif (is_string($input) && is_numeric($input) && self::isEUFloat($input)) {
            $input = str_replace(',', '.', $input);
        } elseif (in_array($input, ['on', 'off'], true)) {
            $input = ('on' === $input) ? true : false;
        } elseif (is_string($input) && is_numeric($input)) {
            if (Str::contains($input, '.')) {
                $input = (float) $input;
            } else {
                $input = (int) $input;
            }
        } else {
            if (empty($input) && 0 !== $input && false !== $input) {
                if (is_array($input)) {
                    $input = [];
                } else {
                    $input = null;
                }
            }
        }

        return $input;
    }

    private static function formatDateSpan(string $property, ?string $value): ?string
    {
        if ($value) {
            $type = str_contains($property, '_from') ? 'from' : 'to';

            if (str_contains($value, ' ')) {
                // if already has hour
                $value = strtok($value);
            }

            if ('from' === $type) {
                $value .= ' 00:00:00';
            }
            if ('to' === $type) {
                $value .= ' 23:59:59';
            }
        }

        return $value;
    }

    private static function isDate(?string $value): bool
    {
        // $date = null;
        // $timestamp = null;
        // try {
        //     if($value){
        //         $date = Carbon::parse($value);
        //         $timestamp = strtotime($value);
        //     }
        // } catch (Exception $ex) {
        // }

        return false; // (bool) ( ! empty($value) && false !== $timestamp && $timestamp > 0 && $timestamp !== $value && $date);
    }

    /**
     * It is possible that form accepts EU float values with comma as decimal separator.
     * This method translates it to US format.
     */
    private static function isEUFloat(?string $value): bool
    {
        if ($value) {
            if (str_contains($value, ',')) {
                $values = explode(',', $value);
                $all_numeric = true;
                foreach ($values as $v) {
                    if ((int) $v !== $v) {
                        $all_numeric = false;
                    }
                }

                return $all_numeric;
            }
        }

        return false;
    }
}
