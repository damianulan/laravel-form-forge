<?php

namespace FormForge;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\Support\Facades\Blade;
use FormForge\BladeComponents\TrixFieldComponent;

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

        $this->loadTranslationsFrom(__DIR__ . '/../lang', 'formforge');

        $this->loadViewsFrom(__DIR__ . '/Views', 'formforge');

        $this->publishes([
            __DIR__ . '/../lang' => $this->app->langPath('vendor/laravel_vendor_core'),
        ], 'lang');


        $this->publishes([
            __DIR__ . '/Config/formforge.php'  => config_path('formforge.php'),
            __DIR__ . '/Public'                 => public_path('vendor/formforge'),
            __DIR__ . '/Views'                  => resource_path('views/vendor/formforge'),
        ], 'formforge');

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {

        Blade::component('trix-field-component', TrixFieldComponent::class);
    }
}
