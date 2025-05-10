<?php

namespace FormForge\Base;

use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator;

use Carbon\Carbon;
use Exception;
use FormForge\FormBuilder;
use Illuminate\Database\Eloquent\Model;
use FormForge\Base\FormRequest;

/**
 * Base class for full Form template.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 * @package FormForge
 */
abstract class Form
{

    /**
     * If you need you can set up conditions, that user must meet to use this Form.
     *
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    public static function authorize(Request $request): bool
    {
        return true;
    }

    /**
     * Check and fix request data for date and float values.
     *
     * @param \Illuminate\Http\Request $request
     * @return \FormForge\Base\FormRequest
     */
    public static function reformatRequest(Request $request): FormRequest
    {
        foreach ($request->all() as $property => $value) {
            if (is_string($value) && self::isDate($value)) {
                if (str_contains($property, '_from') || str_contains($property, '_to')) {
                    $value = self::formatDateSpan($property, $value);
                }
            } elseif (is_string($value) && self::isEUFloat($value)) {
                $value = str_replace(',', '.', $value);
            } else {
                if (empty($value)) {
                    $value = null;
                }
            }
            $request->merge([$property => $value]);
        }

        $form = new static();
        $request = FormRequest::make($request, $form);

        return $request;
    }

    private static function formatDateSpan(string $property, ?string $value): ?string
    {
        if ($value) {
            $type = str_contains($property, '_from') ? 'from' : 'to';

            if (str_contains($value, ' ')) {
                // if already has hour
                $value = strtok($value);
            }

            if ($type === 'from') {
                $value .= ' 00:00:00';
            }
            if ($type === 'to') {
                $value .= ' 23:59:59';
            }
        }
        return $value;
    }

    private static function isDate(?string $value): bool
    {
        $date = null;
        try {
            $date = Carbon::parse($value);
        } catch (Exception $ex) {
        }
        $timestamp = strtotime($value);
        if (!empty($value) && $timestamp !== false && $timestamp > 0 && $timestamp !== $value && $date) {
            return true;
        }
        return false;
    }

    private static function formatDate(string $value)
    {
        return date(config('formforge.date_format'), strtotime($value));
    }

    /**
     * It is possible that form accepts EU float values with comma as decimal separator.
     * This method translates it to US format.
     *
     * @param string|null $value
     * @return bool
     */
    private static function isEUFloat(?string $value)
    {
        if ($value) {
            if (strpos($value, ',') !== false) {
                $values = explode(',', $value);
                $all_numeric = true;
                foreach ($values as $v) {
                    if ((int) $v != $v) {
                        $all_numeric = false;
                    }
                }

                return $all_numeric;
            }
        }
        return false;
    }

    /**
     * Provide form components definition returning an instance of FormBuilder.
     *
     * @param \Illuminate\Http\Request $request
     * @param mixed $model
     * @return \FormForge\FormBuilder
     */
    abstract public static function definition(Request $request, $model = null): FormBuilder;

    /**
     * Provide laravel validation rules.
     *
     * @param \Illuminate\Http\Request $request
     * @param string|null $model_id - model uuid 
     * @return array
     */
    abstract public static function validation(Request $request, ?string $model_id = null): array;

    /**
     * use this method to validate form data
     *
     * @param \Illuminate\Http\Request $request
     * @param string|null              $model_id
     * @return array
     */
    public static function validateJson(Request $request, ?string $model_id = null): array
    {
        if (is_null($model_id)) {
            $id = $request->input('id') ?? null;
            if ($id) {
                $model_id = $id;
            }
        }

        $validator = self::validate($request, $model_id);

        if ($validator->fails()) {
            return [
                'status' => 'error',
                'messages' => $validator->messages(),
            ];
        }
        return [
            'status' => 'ok',
            'messages' => $validator->messages(),
        ];
    }

    public static function validate(Request $request, ?string $model_id = null): Validator
    {
        if (is_null($model_id)) {
            $id = $request->input('id') ?? null;
            if ($id) {
                $model_id = $id;
            }
        }

        return Validator::make($request->all(), static::validation($request, $model_id));
    }
}
