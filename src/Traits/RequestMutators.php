<?php

namespace FormForge\Traits;

use Carbon\Carbon;

trait RequestMutators
{
    use HasAttributes;

    public function mutate(array $attributes = array(), $override = false): static
    {
        foreach ($attributes as $property => $value) {
            $this->setAttribute($property, $value);
        }

        return $this;
    }

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
            if (str_contains($property, '_from') || str_contains($property, '_to')) {
                $input = self::formatDateSpan($property, $input);
            }
        } elseif (is_string($input) && self::isEUFloat($input)) {
            $input = str_replace(',', '.', $input);
        } elseif (in_array($input, array('on', 'off'))) {
            $input = 'on' === $input ? true : false;
        } else {
            if (empty($input)) {
                if (is_array($input)) {
                    $input = array();
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
