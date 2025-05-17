<?php

namespace FormForge;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\Support\Facades\Blade;
use FormForge\BladeComponents\TrixFieldComponent;

/**
 * Undocumented class
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 */
class Provider extends ServiceProvider
{
    /**
     * Register the application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/formforge.php', 'formforge');
    }

    /**
     * When this method is apply we have all laravel providers and methods available
     */
    public function boot(): void
    {

        $this->loadTranslationsFrom(__DIR__ . '/../lang', 'formforge');

        $this->loadViewsFrom(__DIR__ . '/Views', 'formforge');

        $this->publishes([
            __DIR__ . '/../lang'                   => $this->app->langPath('vendor/formforge'),
        ], 'formforge-langs');

        $this->publishes([
            __DIR__ . '/Views'                     => resource_path('views/vendor/formforge'),
        ], 'formforge-views');

        $this->publishes([
            __DIR__ . '/../config/formforge.php'   => config_path('formforge.php'),
            __DIR__ . '/../resources/style'        => resource_path('vendor/formforge/style'),
        ], 'formforge');

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {

        Blade::component('trix-field-component', TrixFieldComponent::class);
    }
}
