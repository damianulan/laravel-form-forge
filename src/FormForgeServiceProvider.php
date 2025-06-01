<?php

namespace FormForge;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\Support\Facades\Blade;
use FormForge\BladeComponents\TrixFieldComponent;
use FormForge\Commands\FormMakeCommand;

/**
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @package FormForge
 * @license MIT
 */
class FormForgeServiceProvider extends ServiceProvider
{
    /**
     * Register the application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/formforge.php', 'formforge');
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
    }

    /**
     * When this method is apply we have all laravel providers and methods available
     */
    public function boot(): void
    {
        Blade::if('setting', function ($key) {
            return setting($key);
        });

        $this->loadTranslationsFrom(__DIR__ . '/../lang', 'formforge');

        $this->loadViewsFrom(__DIR__ . '/Views', 'formforge');

        $this->publishes([
            __DIR__ . '/../lang'                   => $this->app->langPath('vendor/formforge'),
        ], 'formforge-langs');

        $this->publishes([
            __DIR__ . '/../config/formforge.php'   => config_path('formforge.php'),
        ], 'formforge-config');

        $this->publishes([
            __DIR__ . '/Views'                     => resource_path('views/vendor/formforge'),
        ], 'formforge-views');

        $this->publishes([
            __DIR__ . '/../resources/style'        => resource_path('vendor/formforge/style'),
        ], 'formforge-resources');

        $this->publishes([
            __DIR__ . '/../stubs'                  => base_path('stubs'),
            __DIR__ . '/../config/formforge.php'   => config_path('formforge.php'),
            __DIR__ . '/../resources/style'        => resource_path('vendor/formforge/style'),
        ], 'formforge');

        if ($this->app->runningInConsole()) {
            $this->commands([
                FormMakeCommand::class,
            ]);
        }

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {

        Blade::component('trix-field-component', TrixFieldComponent::class);
    }
}
