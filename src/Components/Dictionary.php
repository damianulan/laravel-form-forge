<?php

namespace FormForge\Components;

use FormForge\Enums\Enum;
use Illuminate\Support\Collection;
use ReflectionClass;

class Dictionary
{
    /**
     * Get data for select directly from model.
     */
    public static function fromModel(
        string $model,
        string $attribute,
        string $method = 'all',
        array $exclude = array()
    ): Collection {
        $options = new Collection();

        if (class_exists($model)) {
            $records = $model::$method();
            if ( ! empty($records)) {
                if (count($exclude)) {
                    foreach ($exclude as $condition) {
                        $records = $records->filter(function (
                            $record,
                            int $key
                        ) use ($condition) {
                            foreach ($condition as $prop => $value) {
                                if (
                                    isset($record->{$prop}) &&
                                    $record->{$prop} === $value
                                ) {
                                    return false;
                                }
                            }

                            return true;
                        });
                    }
                }
                foreach ($records as $record) {
                    if (isset($record->{$attribute})) {
                        $options->push(
                            new Option($record->id, $record->{$attribute})
                        );
                    }
                }
            }
        }

        return $options;
    }

    /**
     * Create select from array values.
     *
     * @param  string  $lang_component  - use if your array values are lang keys.
     */
    public static function fromUnassocArray(
        array $values,
        string $lang_component = ''
    ): Collection {
        $options = new Collection();

        if ( ! empty($values)) {
            foreach ($values as $value) {
                $content = ucfirst($value);
                if ( ! empty($lang_component)) {
                    $content = __($lang_component . '.' . $value);
                }
                $options->push(new Option($value, $content));
            }
        }

        return $options;
    }

    /**
     * @param  array  $values  Here database value as an array's key.
     */
    public static function fromAssocArray(array $values): Collection
    {
        $options = new Collection();

        if ( ! empty($values)) {
            foreach ($values as $value => $content) {
                $options->push(new Option($value, $content));
            }
        }

        return $options;
    }

    /**
     * Simple true/false select
     */
    public static function yesNo(): Collection
    {
        $options = new Collection();

        $options->push(new Option(1, __('formforge::forms.yes')));
        $options->push(new Option(0, __('formforge::forms.no')));

        return $options;
    }

    /**
     * Matching enum-like classes or proper Enum objects with readable labels.
     * If your enum does not implement `label` attribute, you should provide it in the second parameter.
     *
     * @param  string|object  $enum_class  - enum class namespace
     * @param  array  $readables  - array of enum values with readable labels and keys matching given enum values
     *
     * @see damianulan/php-enumerable for perfect implementation.
     */
    public static function fromEnum(string|object $enum_class, array $readables = array()): Collection
    {
        $options = new Collection();
        if (is_object($enum_class)) {
            $enum_class = get_class($enum_class);
        }
        if (class_exists($enum_class)) {
            $reflection = new ReflectionClass($enum_class);

            if ($reflection->hasMethod('cases')) {
                foreach ($enum_class::cases() as $case) {
                    $label = null;
                    if (isset($readables[$case->value])) {
                        $label = $readables[$case];
                    } else {
                        if (isset($case->label)) {
                            $label = $case->label;
                        } else {
                            $label = $case->value;
                        }
                    }
                    $options->push(new Option($case->value, $label));
                }
            } else {
                throw new \Exception('Enum class does not implement cases() method.');
            }
        }

        return $options;
    }
}
