<?php

namespace FormForge;

use FormForge\Helpers\Config;
use Illuminate\Database\Schema\Blueprint;

class MacroFactory
{
    public static function load(): void
    {
        Blueprint::macro('personstamps', function (): Blueprint {
            foreach (config('formforge.personstamps.fields') as $property) {
                $field = Config::personstampsFieldType();
                $this->{$field}($property)->nullable();

                $table = config('formforge.personstamps.table');
                if ( ! empty($table)) {
                    $this->foreign($property)->references('id')->on($table);
                }
            }

            return $this;
        });
    }
}
