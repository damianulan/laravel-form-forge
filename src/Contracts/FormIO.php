<?php

namespace FormForge\Contracts;

use FormForge\FormBuilder;
use Illuminate\Support\Facades\Request;

interface FormIO
{
    /**
     * Provide form components definition returning an instance of FormBuilder.
     *
     * @param \Illuminate\Support\Facades\Request $request
     * @param Illuminate\Database\Eloquent\Model|null $model
     * @return \FormForge\FormBuilder
     */
    public static function definition(Request $request, $model = null): FormBuilder;

    /**
     * Provide laravel validation rules.
     *
     * @param \Illuminate\Support\Facades\Request $request
     * @param string|null $model_id - model uuid 
     * @return array
     */
    public static function validation(Request $request, $model_id = null): array;
}
