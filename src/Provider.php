<?php

namespace FormForge;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

class Provider extends ServiceProvider
{
    /**
     * Register the application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/Config/formforge.php', 'formforge');
    }

    /**
     * When this method is apply we have all laravel providers and methods available
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/Views', 'formforge');

        $this->publishes([
            __DIR__ . '/Config/apexcharts.php'  => config_path('formforge.php'),
            __DIR__ . '/Public'                 => public_path('vendor/formforge'),
            __DIR__ . '/Views'                  => resource_path('views/vendor/formforge'),
        ], 'formforge');

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {

    }
}