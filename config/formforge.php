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
    'storage' => [
        'handling_files' => env('FORMFORGE_HANDLING_FILES', true),
        'path' => storage_path('app/public/uploads'),
    ],

    /**
     * Dispatches FormForge rendering events.
     */
    'dispatches_events' => true,

    /**
     * If you need to fill your form request model instance with personstamps,
     * declare columns to fill with Auth::user()->id automatically.
     * Remember to also keep them in your model's $fillable array.
     *
     * You can add personstamps to your tables when migrating: `$table->personstamps();`
     */
    'personstamps' => [
        'fields' => [
            'created_by',
            'updated_by',
            'deleted_by',
        ],
        'type' => 'integer',
        'table' => 'users', // set null if you don't want to index when calling $table->personstamps() in your migrations
    ],

    'mews_purifier_setting' => [
        'HTML.Allowed' => 'h1,h2,h3,h4,h5,h6,b,strong,i,em,u,a[href|title|target],ul,ol,li,p[style|class],br,span[style|class],img[width|height|alt|src],blockquote,pre,code,table,thead,tbody,tr,th,td',
        'CSS.AllowedProperties' => 'font-weight,font-style,text-decoration,padding-left,color,background-color,text-align',
        'HTML.Nofollow' => true,
        'HTML.TargetBlank' => true,
        'URI.AllowedSchemes' => [
            'http' => true,
            'https' => true,
            'mailto' => true,
        ],
        'Attr.AllowedClasses' => [
            'ql-align-center',
            'ql-align-right',
            'ql-align-justify',
            'text-center', // Bootstrap
            'text-right',
        ],
    ],

];
