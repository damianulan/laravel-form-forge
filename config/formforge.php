<?php

return [

    /*
    |--------------------------------------------------------------------------
    | FormForge Default Options v1.1
    |--------------------------------------------------------------------------
    |
    | These are default options that will be used in module.
    |
    */

    /**
     * This template will be used as default for all forms.
     * Use ->template() method in your FormBuilder to change it.
     */
    'default' => env('FORMFORGE_TEMPLATE', 'horizontal'),

    'templates' => [
        'horizontal' => [],
        '2columns' => [],
        'vertical' => [],
    ],

    /**
     * Declare the default date format, that will be used in date fields.
     */
    'date_format' => env('FORMFORGE_DATE_FORMAT', 'Y-m-d'),
    'time_format' => env('FORMFORGE_TIME_FORMAT', 'H:i'),
    'datetime_format' => env('FORMFORGE_DATETIME_FORMAT', 'Y-m-d H:i'),

    /**
     * Process uploaded files with reformatRequest method.
     */
    'handling_files' => env('FORMFORGE_HANDLING_FILES', true),

    /**
     * Dispatches FormForge rendering events.
     */
    'dispatches_events' => true,

    /**
     * If you need to fill your form request model instance with personstamps,
     * declare columns to fill with Auth::user()->id automatically.
     * Remember to also keep them in your model's $fillable array.
     */
    'personstamps' => [
        'created_by',
        'updated_by',
        'deleted_by',
    ],

];
