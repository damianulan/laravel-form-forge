<?php

namespace FormForge\Contracts;

use FormForge\FormBuilder;

interface FormIO
{
    public static function boot($model = null): FormBuilder;
    public static function validation($model = null): array;
}
