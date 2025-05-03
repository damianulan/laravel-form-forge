<?php

use FormForge\Enums\Template;

return [

    /*
    |--------------------------------------------------------------------------
    | FormForge Default Options
    |--------------------------------------------------------------------------
    |
    | This is the default options that will be used in module.
    |
    */

    'date_format' => env('FORMFORGE_DATE_FORMAT', 'Y-m-d'),

    'handling_files' => env('FORMFORGE_HANDLING_FILES', true),

    'defaults' => [
        'template' => env('FORMFORGE_TEMPLATE', Template::HORIZONTAL),
    ],
];
