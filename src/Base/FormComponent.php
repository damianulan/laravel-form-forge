<?php

namespace FormForge\Base;

use FormForge\Components\Checkbox;
use FormForge\Components\Container;
use FormForge\Components\Daterange;
use FormForge\Components\Datetime;
use FormForge\Components\File;
use FormForge\Components\Input;
use FormForge\Components\Select;
use FormForge\Components\Textarea;
use Illuminate\Support\Collection;
use Illuminate\Support\Traits\Macroable;

/**
 * FormComponent to be collected by FormBuilder. Methods return input instructions (a field) and each represents field in form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 */
class FormComponent
{
    use Macroable;

    /**
     * Returns input instruction for simple text type.
     *
     * @param  mixed  $model
     */
    public static function text(string $name, $model = null): Input
    {
        $value = $model->{$name} ?? null;

        return new Input($name, 'text', $value);
    }

    /**
     * Returns numeric input instruction for text type requiring only numbers as input.
     *
     * @param  mixed  $model
     */
    public static function numeric(string $name, $model = null): Input
    {
        $value = $model->{$name} ?? null;

        return (new Input($name, 'text', $value))->numeric();
    }

    /**
     * Returns numeric input instruction for text type requiring numbers with two floating points as number.
     *
     * @param  mixed  $model
     */
    public static function decimal(string $name, $model = null): Input
    {
        $value = $model->{$name} ?? null;

        return (new Input($name, 'text', $value))->decimal();
    }

    /**
     * Returns input instruction for password type.
     *
     * @param  mixed  $model
     */
    public static function password(string $name, $model = null): Input
    {
        $value = $model->{$name} ?? null;

        return new Input($name, 'password', $value);
    }

    /**
     * Returns hidden input instruction for any type.
     *
     * @param  mixed  $model
     * @param  mixed  $val
     */
    public static function hidden(
        string $name,
        $model = null,
        $val = null
    ): Input {
        $value = $model->{$name} ?? null;
        if ( ! $value && $val) {
            $value = $val;
        }

        return new Input($name, 'hidden', $value);
    }

    /**
     * Returns single select type instruction pregenerated with chosen.js.
     *
     * @param  mixed  $model
     * @param  mixed  $selected_value
     */
    public static function select(
        string $name,
        $model = null,
        ?Collection $options = null,
        $selected_value = null
    ): Select {
        $value = $model->{$name} ?? null;

        if (is_object($value)) {
            $value = $value->value;
        }
        if ( ! is_null($selected_value)) {
            if ( ! is_array($selected_value)) {
                $value = $selected_value;
            } else {
                $value = reset($selected_value);
            }
        }

        return new Select($name, $options, array($value));
    }

    /**
     * Returns multiple select type instruction pregenerated with chosen.js.
     *
     * @param  mixed  $model
     * @param  mixed  $relation  - method name for model relationships you want to use
     * @param  array  $selected_values
     */
    public static function multiselect(
        string $name,
        $model = null,
        ?Collection $options = null,
        $relation = null,
        $selected_values = array()
    ): Select {
        $values = array();
        if (count($selected_values)) {
            $values = $selected_values;
        }

        if ($relation && $model && $model->{$relation}) {
            $values = $model->{$relation}->modelKeys() ?? array();
        } else {
            if ($model && empty($selected_values) && isset($model->{$name}) && is_array($model->{$name})) {
                $values = $model->{$name} ?? array();
            }
        }

        return (new Select($name, $options, $values))->multiple();
    }

    /**
     * Returns simple div container with hidden input.
     *
     * @param  mixed  $model
     */
    public static function container(string $name, $model = null): Container
    {
        $value = $model->{$name} ?? null;

        return new Container($name, $value);
    }

    /**
     * Returns simple textarea input.
     *
     * @param  mixed  $model
     */
    public static function textarea(string $name, $model = null): Textarea
    {
        $value = $model->{$name} ?? null;

        return new Textarea($name, $value);
    }

    /**
     * Returns date and time input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function datetime(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->{$name} ?? null;

        return new Datetime($name, 'datetime', $value, $minDate, $maxDate);
    }

    /**
     * Returns a time input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function time(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->{$name} ?? null;

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function date(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->{$name} ?? null;

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date range type input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     */
    public static function daterange(string $name, $model = null): Daterange
    {
        $from = $name . '_from';
        $to = $name . '_to';
        $values = array(
            'from' => $model->{$from} ?? null,
            'to' => $model->{$to} ?? null,
        );

        return new Daterange($name, 'date', $values);
    }

    /**
     * Returns a birthdate type input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function birthdate(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->{$name} ?? null;

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a boolean radio type input instruction.
     *
     * @param  mixed  $model
     */
    public static function radio(string $name, $model = null): Checkbox
    {
        $value = $model->{$name} ?? null;

        return new Checkbox($name, 'radio', $value);
    }

    /**
     * Returns a boolean checkbox type input instruction.
     *
     * @param  mixed  $model
     */
    public static function checkbox(string $name, $model = null): Checkbox
    {
        $value = $model->{$name} ?? null;

        return new Checkbox($name, 'checkbox', $value);
    }

    /**
     * Returns a boolean switch type input instruction.
     *
     * @param  mixed  $model
     */
    public static function switch(string $name, $model = null): Checkbox
    {
        $value = $model->{$name} ?? null;

        return new Checkbox($name, 'switch', $value);
    }

    /**
     * Returns a file import type input instruction.
     *
     * @param  mixed  $model
     * @param  array  $accepted_types  - accepted mime types according to html5 spec
     */
    public static function file(string $name, $model = null, array $accepted_types = array()): File
    {
        $value = false;
        if (isset($model->{$name}) && ! empty($model->{$name})) {
            $value = true;
        }

        return new File($name, $value, $accepted_types);
    }
}
