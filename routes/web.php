<?php

use Illuminate\Support\Facades\Route;

Route::get('/js/formforge.js', function () {
    $path = __DIR__ . '/../resources/js_page/formforge.js';

    return response()
        ->file($path, [
            'Content-Type' => 'application/javascript',
        ]);
})->middleware('web');
