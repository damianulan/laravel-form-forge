<?php

namespace FormForge;

use FormForge\BladeComponents\TrixFieldComponent;
use FormForge\Commands\FormMakeCommand;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

/**
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
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
        $this->loadTranslationsFrom(__DIR__ . '/../lang', 'formforge');

        $this->loadViewsFrom(__DIR__ . '/Views', 'formforge');

        $this->publishes(array(
            __DIR__ . '/../lang' => $this->app->langPath('vendor/formforge'),
        ), 'formforge-langs');

        $this->publishes(array(
            __DIR__ . '/../config/formforge.php' => config_path('formforge.php'),
        ), 'formforge-config');

        $this->publishes(array(
            __DIR__ . '/Views' => resource_path('views/vendor/formforge'),
        ), 'formforge-views');

        $this->publishes(array(
            __DIR__ . '/../resources/style' => resource_path('vendor/formforge/style'),
            __DIR__ . '/../resources/js' => resource_path('vendor/formforge/js'),
        ), 'formforge-resources');

        $this->publishes(array(
            __DIR__ . '/../stubs' => base_path('stubs'),
            __DIR__ . '/../config/formforge.php' => config_path('formforge.php'),
            __DIR__ . '/../resources/style' => resource_path('vendor/formforge/style'),
            __DIR__ . '/../resources/js' => resource_path('vendor/formforge/js'),
        ), 'formforge');

        if ($this->app->runningInConsole()) {
            $this->commands(array(
                FormMakeCommand::class,
            ));
        }

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {
        Blade::component('trix-field-component', TrixFieldComponent::class);

        Blade::directive('formForgeScripts', fn () => view('formforge::scripts'));
    }
}
