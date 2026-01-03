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
use Illuminate\Database\Eloquent\Model;

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
    public static function text(string $name, Model|string|null $default = null): Input
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Input($name, 'text', $value);
    }

    /**
     * Returns numeric input instruction for text type requiring only numbers as input.
     *
     * @param  mixed  $model
     */
    public static function numeric(string $name, Model|int|float|string|null $default = null): Input
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return (new Input($name, 'text', $value))->numeric();
    }

    /**
     * Returns numeric input instruction for text type requiring numbers with two floating points as number.
     *
     * @param  mixed  $model
     */
    public static function decimal(string $name, Model|float|string|null $default = null): Input
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return (new Input($name, 'text', $value))->decimal();
    }

    /**
     * Returns input instruction for password type.
     *
     * @param  mixed  $model
     */
    public static function password(string $name, Model|string|null $default = null): Input
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

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
        Model|string|int|null $default = null
    ): Input {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
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
        Model|string|null $default = null,
        ?Collection $options = null,
    ): Select {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Select($name, $options, [$value]);
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
        Model|array|Collection|null $default = null,
        ?Collection $options = null
    ): Select {
        $values = [];
        if($default instanceof Model){
            $values = self::getObjectValue($name, $default);
        }
        else if($default instanceof Collection){
            $values = $default->toArray();
        } else {
            if($default){
                $values = $default;
            }
        }

        return (new Select($name, $options, $values ?? []))->multiple();
    }

    /**
     * Returns simple div container with hidden input.
     * Great for custom js-based rich text editors.
     *
     * @param  mixed  $model
     */
    public static function container(string $name, $default = null): Container
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Container($name, $value);
    }

    /**
     * Returns simple textarea input.
     *
     * @param  mixed  $model
     */
    public static function textarea(string $name, Model|string|null $default = null): Textarea
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Textarea($name, $value);
    }

    /**
     * Returns date and time input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function datetime(string $name, Model|string|null $default = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Datetime($name, 'datetime', $value, $minDate, $maxDate);
    }

    /**
     * Returns a time input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function time(string $name, Model|string|null $default = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function date(string $name, Model|string|null $default = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a date range type input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     */
    public static function daterange(string $name, Model|array|null $default = null): Daterange
    {
        $from = $name . '_from';
        $to = $name . '_to';
        $values = [];
        if($default instanceof Model){
            $values = [
                'from' => self::getObjectValue($from, $default),
                'to' => self::getObjectValue($to, $default),
            ];
        }
        else if(is_array($default)){
            $values = [
                'from' => $default['from'] ?? null,
                'to' => $default['to'] ?? null,
            ];
        }

        return new Daterange($name, 'date', $values);
    }

    /**
     * Returns a birthdate type input instruction pregenerated with flatpickr.js.
     *
     * @param  mixed  $model
     * @param  string|null  $minDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     * @param  string|null  $maxDate  - format: Y-m-d or Y-m-d H:i:s or H:i:s
     */
    public static function birthdate(string $name, Model|string|null $default = null, ?string $minDate = null, ?string $maxDate = null): Datetime
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Datetime($name, __FUNCTION__, $value, $minDate, $maxDate);
    }

    /**
     * Returns a boolean radio type input instruction.
     *
     * @param  mixed  $model
     */
    public static function radio(string $name, Model|bool|null $default = null): Checkbox
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Checkbox($name, 'radio', $value);
    }

    /**
     * Returns a boolean checkbox type input instruction.
     *
     * @param  mixed  $model
     */
    public static function checkbox(string $name, Model|bool|null $default = null): Checkbox
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Checkbox($name, 'checkbox', $value);
    }

    /**
     * Returns a boolean switch type input instruction.
     *
     * @param  mixed  $model
     */
    public static function switch(string $name, Model|bool|null $default = null): Checkbox
    {
        $value = $default;
        if($default instanceof Model){
            $value = self::getObjectValue($name, $default);
        }

        return new Checkbox($name, 'switch', $value);
    }

    /**
     * Returns a file import type input instruction.
     *
     * @param  mixed  $model
     * @param  array  $accepted_types  - accepted mime types according to html5 spec
     */
    public static function file(string $name, $model = null, array $accepted_types = []): File
    {
        $value = false;
        if (isset($model->{$name}) && ! empty($model->{$name})) {
            $value = true;
        }

        return new File($name, $value, $accepted_types);
    }

    protected static function getObjectValue(string $name, ?Model $model = null)
    {
        $value = $model->{$name} ?? null;

        if($value){
            if(($value instanceof \UnitEnum) || ($value instanceof \Enumerable\Enum)){
                $value = $value->value;
            }
        }

        return $value;
    }
}
