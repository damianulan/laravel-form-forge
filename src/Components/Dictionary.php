<?php

namespace FormForge\Components;

use Illuminate\Support\Collection;

class Dictionary
{
    /**
     * Declare array collections of options accessible to the public.
     */
    public $mail_encryption_methods = [
        "tls" => "TLS",
        "ssl" => "SSL",
        "starttls" => "STARTTLS",
        "null" => "PLAIN",
    ];

    public static function fromModel(
        string $model,
        string $column,
        string $method = "all",
        array $exclude = []
    ): Collection {
        $options = new Collection();

        if (class_exists($model)) {
            $records = $model::$method();
            if (!empty($records)) {
                if (count($exclude)) {
                    foreach ($exclude as $condition) {
                        $records = $records->filter(function (
                            $record,
                            int $key
                        ) use ($condition) {
                            foreach ($condition as $prop => $value) {
                                if (
                                    isset($record->$prop) &&
                                    $record->$prop === $value
                                ) {
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                }
                foreach ($records as $record) {
                    if (method_exists($model, $column)) {
                        $options->push(
                            new Option($record->id, $record->$column())
                        );
                    } else {
                        $options->push(
                            new Option($record->id, $record->$column)
                        );
                    }
                }
            }
        }

        return $options;
    }

    public static function fromUnassocArray(
        array $values,
        string $lang_component = ""
    ): Collection {
        $options = new Collection();

        if (!empty($values)) {
            foreach ($values as $value) {
                $content = ucfirst($value);
                if (!empty($lang_component)) {
                    $content = __($lang_component . "." . $value);
                }
                $options->push(new Option($value, $content));
            }
        }

        return $options;
    }

    /**
     * @param array $values Here database value as an array's key.
     */
    public static function fromAssocArray(array $values): Collection
    {
        $options = new Collection();

        if (!empty($values)) {
            foreach ($values as $value => $content) {
                $options->push(new Option($value, $content));
            }
        }

        return $options;
    }

    public static function fromCatalog(string $index): ?Collection
    {
        $instance = new self();

        if (isset($instance->$index)) {
            return self::fromAssocArray($instance->$index);
        }

        return null;
    }

    public static function yesNo(): Collection
    {
        $options = new Collection();

        $options->push(new Option(1, __("formforge::forms.yes")));
        $options->push(new Option(0, __("formforge::forms.no")));

        return $options;
    }

    /**
     * Enum equivalents should be translated in fields.php
     */
    public static function fromEnum($enum): Collection
    {
        $options = new Collection();
        if (class_exists($enum)) {
            foreach ($enum::values() as $case) {
                $options->push(new Option($case, __("formforge::forms.enums." . $case)));
            }
        }
        return $options;
    }
}
