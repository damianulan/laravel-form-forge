<?php

namespace FormForge\Base;

use FormForge\Components\Input;
use FormForge\Components\Checkbox;
use FormForge\Components\Select;
use FormForge\Components\Datetime;
use FormForge\Components\Daterange;
use FormForge\Components\File;
use FormForge\Components\Trix;
use Illuminate\Support\Collection;

/**
 * FormComponent to be collected by FormBuilder. Methods return input instructions (a field) and each represents field in form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 */
class FormComponent
{
    /**
     * Returns input instruction for simple text type.
     *
     * @param  string $name
     * @param  mixed  $model
     * @return Input
     */
    public static function text(string $name, $model = null): Input
    {
        $value = $model->$name ?? null;
        return new Input($name, "text", $value);
    }

    /**
     * Returns numeric input instruction for text type requiring only numbers as input.
     *
     * @param  string $name
     * @param  mixed  $model
     * @return Input
     */
    public static function numeric(string $name, $model = null): Input
    {
        $value = $model->$name ?? null;
        return (new Input($name, "text", $value))->numeric();
    }

    /**
     * Returns numeric input instruction for text type requiring numbers with two floating points as number.
     *
     * @param  string $name
     * @param  mixed  $model
     * @return Input
     */
    public static function decimal(string $name, $model = null): Input
    {
        $value = $model->$name ?? null;
        return (new Input($name, "text", $value))->decimal();
    }

    /**
     * Returns input instruction for password type.
     *
     * @param  string $name
     * @param  mixed  $model
     * @return Input
     */
    public static function password(string $name, $model = null): Input
    {
        $value = $model->$name ?? null;
        return new Input($name, "password", $value);
    }

    /**
     * Returns hidden input instruction for any type.
     *
     * @param  string $name
     * @param  mixed  $model
     * @param  mixed  $val
     * @return Input
     */
    public static function hidden(
        string $name,
        $model = null,
        $val = null
    ): Input {
        $value = $model->$name ?? null;
        if (!$value && $val) {
            $value = $val;
        }
        return new Input($name, "hidden", $value);
    }

    /**
     * Returns single select type instruction pregenerated with chosen.js.
     *
     * @param  string          $name
     * @param  mixed           $model
     * @param  Collection|null $options
     * @param  mixed           $selected_value
     * @return Select
     */
    public static function select(
        string $name,
        $model = null,
        ?Collection $options = null,
        $selected_value = null
    ): Select {
        $value = $model->$name ?? null;

        if (is_object($value)) {
            $value = $value->value;
        }
        if (!is_null($selected_value)) {
            if (!is_array($selected_value)) {
                $value = $selected_value;
            } else {
                $value = reset($selected_value);
            }
        }

        return new Select($name, $options, [$value]);
    }

    /**
     * Returns multiple select type instruction pregenerated with chosen.js.
     *
     * @param  string          $name
     * @param  mixed           $model
     * @param  Collection|null $options
     * @param  mixed           $relation - method name for model relationships you want to use
     * @param  array           $selected_values
     * @return Select
     */
    public static function multiselect(
        string $name,
        $model = null,
        ?Collection $options = null,
        $relation = null,
        $selected_values = []
    ): Select {
        $values = [];
        if ($relation && $model && $model->$relation) {
            $values = $model->$relation->modelKeys() ?? [];
        }

        if (count($selected_values)) {
            $values = $selected_values;
        }
        return (new Select($name, $options, $values))->multiple();
    }

    /**
     * Returns rich edited textarea type instruction pregenerated with trix.js.
     *
     * @param  string $name
     * @param  mixed  $model
     * @param  string $toolbar
     * @return Trix
     */
    public static function trix(
        string $name,
        $model = null,
        string $toolbar = "short"
    ): Trix {
        $value = $model->$name ?? null;
        return new Trix($name, $toolbar, $value);
    }

    /**
     * Returns date and time input instruction pregenerated with flatpickr.js.
     *
     * @param string      $name
     * @param mixed       $model
     * @param string|null $minDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param string|null $maxDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @return \FormForge\Components\Datetime
     */
    public static function datetime(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->$name ?? null;
        return new Datetime($name, "datetime", $value, $minDate, $maxDate);
    }

    /**
     * Returns a time input instruction pregenerated with flatpickr.js.
     *
     * @param string      $name
     * @param mixed       $model
     * @param string|null $minDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param string|null $maxDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @return \FormForge\Components\Datetime
     */
    public static function time(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->$name ?? null;
        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date input instruction pregenerated with flatpickr.js.
     *
     * @param string      $name
     * @param mixed       $model
     * @param string|null $minDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param string|null $maxDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @return \FormForge\Components\Datetime
     */
    public static function date(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->$name ?? null;
        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date range type input instruction pregenerated with flatpickr.js.
     *
     * @param  string   $name
     * @param  mixed    $model
     * @return Daterange
     */
    public static function daterange(string $name, $model = null): Daterange
    {
        $from = $name . "_from";
        $to = $name . "_to";
        $values = [
            "from" => $model->$from ?? null,
            "to" => $model->$to ?? null,
        ];
        return new Daterange($name, "date", $values);
    }

    /**
     * Returns a birthdate type input instruction pregenerated with flatpickr.js.
     *
     * @param string      $name
     * @param mixed       $model
     * @param string|null $minDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param string|null $maxDate - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @return \FormForge\Components\Datetime
     */
    public static function birthdate(string $name, $model = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $model->$name ?? null;
        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a boolean radio type input instruction.
     *
     * @param  string   $name
     * @param  mixed    $model
     * @return Checkbox
     */
    public static function radio(string $name, $model = null): Checkbox
    {
        $value = $model->$name ?? null;
        return new Checkbox($name, "radio", $value);
    }

    /**
     * Returns a boolean checkbox type input instruction.
     *
     * @param  string   $name
     * @param  mixed    $model
     * @return Checkbox
     */
    public static function checkbox(string $name, $model = null): Checkbox
    {
        $value = $model->$name ?? null;
        return new Checkbox($name, "checkbox", $value);
    }

    /**
     * Returns a boolean switch type input instruction.
     *
     * @param  string   $name
     * @param  mixed    $model
     * @return Checkbox
     */
    public static function switch(string $name, $model = null): Checkbox
    {
        $value = $model->$name ?? null;
        return new Checkbox($name, "switch", $value);
    }

    /**
     * Returns a file import type input instruction.
     *
     * @deprecated do not use - not correctly tested yet.
     * @param  string   $name
     * @param  mixed    $model
     * @return File
     */
    public static function file(string $name, $model = null): File
    {
        $value = false;
        if (isset($model->$name) && !empty($model->$name)) {
            $value = true;
        }
        return new File($name, $value);
    }
}
