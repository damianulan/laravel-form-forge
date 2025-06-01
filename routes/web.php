<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/js/formforge.js', function () {
    return response()
        ->view('formforge::js-content')
        ->header('Content-Type', 'application/javascript');
});
