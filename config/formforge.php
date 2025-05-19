<?php

return [

    /*
    |--------------------------------------------------------------------------
    | FormForge Default Options v1.0
    |--------------------------------------------------------------------------
    |
    | These are default options that will be used in module.
    |
    */

    'default' => env('FORMFORGE_TEMPLATE', 'horizontal'),

    'templates' => [
        'horizontal' => [],
        '2columns' => []
    ],

    /**
     * Declare the default date format, that will be used in date fields.
     */
    'date_format' => env('FORMFORGE_DATE_FORMAT', 'Y-m-d'),

    /**
     * Process uploaded files with reformatRequest method.
     */
    'handling_files' => env('FORMFORGE_HANDLING_FILES', true),

];
