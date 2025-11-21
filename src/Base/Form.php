<?php

namespace FormForge\Base;

use Carbon\Carbon;
use Exception;
use FormForge\Events\FormValidationFail;
use FormForge\Events\FormValidationSuccess;
use FormForge\FormBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorInstance;

/**
 * Base class for full Form template.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 */
abstract class Form
{
    /**
     * custom route key to redirect back to after form validation
     */
    protected static ?string $backRoute = null;

    /**
     * custom route params to redirect back to after form validation
     */
    protected static array $backParams = array();

    /**
     * Provide form components definition returning an instance of FormBuilder.
     *
     * @param  mixed  $model
     */
    abstract public static function definition(Request $request, $model = null): FormBuilder;

    /**
     * Provide laravel validation rules.
     *
     * @param  string|null  $model_id  - model uuid
     */
    abstract public static function validation(Request $request, ?string $model_id = null): array;

    /**
     * Check and fix request data for date and float values.
     */
    public static function reformatRequest(Request $request): Request
    {
        foreach ($request->all() as $property => $value) {
            if (is_string($value) && self::isDate($value)) {
                if (str_contains($property, '_from') || str_contains($property, '_to')) {
                    $value = self::formatDateSpan($property, $value);
                }
            } elseif (is_string($value) && self::isEUFloat($value)) {
                $value = str_replace(',', '.', $value);
            } elseif (in_array($value, array('on', 'off'))) {
                $value = 'on' === $value ? true : false;
            } else {
                if (empty($value)) {
                    $value = null;
                }
            }
            $request->merge(array($property => $value));
        }

        return $request;
    }

    /**
     * Use this method to validate form data. It returns an array with result and message stack.
     */
    public static function validateJson(Request $request, ?string $model_id = null): array
    {

        $validator = self::validator($request, $model_id);

        if ($validator->fails()) {
            FormValidationFail::dispatch(static::class, $validator->messages());

            return array(
                'status' => 'error',
                'messages' => $validator->messages(),
            );
        }
        FormValidationSuccess::dispatch(static::class, $validator->messages());

        return array(
            'status' => 'ok',
            'messages' => $validator->messages(),
        );
    }

    /**
     * Use this method to validate form data. When bumped into error it automatically redirects back.
     * Override $backRoute and $backParams to customize redirection target.
     */
    public static function validate(Request $request, ?string $model_id = null): void
    {
        $validator = static::validator($request, $model_id);

        if ($validator->fails()) {
            if (static::$backRoute) {
                $to = route(static::$backRoute, static::$backParams);
                FormValidationFail::dispatch(static::class, $validator->messages());
                abort(Redirect::to($to)->withErrors($validator)->withInput());
            }
            FormValidationFail::dispatch(static::class, $validator->messages());
            abort(Redirect::back()->withErrors($validator)->withInput());
        } else {
            FormValidationSuccess::dispatch(static::class, $validator->messages());
        }
    }

    /**
     * Returns a raw validator instance. Best for custom logic.
     */
    public static function validator(Request $request, ?string $model_id = null): ValidatorInstance
    {
        if (is_null($model_id)) {
            $id = $request->input('id') ?? null;
            if ($id) {
                $model_id = $id;
            }
        }

        return Validator::make($request->all(), static::validation($request, $model_id), static::messages(), static::attributes());
    }

    /**
     * Custom laravel validation messages.
     */
    protected static function messages(): array
    {
        return array();
    }

    /**
     * Custom laravel validation attributes.
     */
    protected static function attributes(): array
    {
        $attributes = array();

        $builder = static::definition(request());
        if ($builder) {
            foreach ($builder->getComponents() as $component) {
                $attributes[$component->name] = $component->label;
            }
        }

        return $attributes;
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
        $date = null;
        try {
            $date = Carbon::parse($value);
        } catch (Exception $ex) {
        }
        $timestamp = strtotime($value);

        return (bool) (! empty($value) && false !== $timestamp && $timestamp > 0 && $timestamp !== $value && $date);
    }

    /**
     * It is possible that form accepts EU float values with comma as decimal separator.
     * This method translates it to US format.
     *
     * @return bool
     */
    private static function isEUFloat(?string $value)
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
