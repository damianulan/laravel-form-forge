<?php

namespace FormForge\Contracts;

use FormForge\FormBuilder;

interface FormIO
{
    /**
     * Provide form components definition returning an instance of FormBuilder.
     *
     * @param Illuminate\Database\Eloquent\Model|null $model
     * @return \FormForge\FormBuilder
     */
    public static function definition($model = null): FormBuilder;

    /**
     * Provide laravel validation rules.
     *
     * @param Illuminate\Database\Eloquent\Model|null $model
     * @return array
     */
    public static function validation($model = null): array;
}
