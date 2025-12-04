<?php

namespace FormForge;

use FormForge\Base\Form;
use FormForge\Commands\FormMakeCommand;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Request;
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

        $this->app->resolving(Form::class, fn (Form $form) => $form->boot()->mutate(Request::all())->setDefinition()->booted());
    }

    /**
     * When this method is apply we have all laravel providers and methods available
     */
    public function boot(): void
    {
        $this->loadTranslationsFrom(__DIR__ . '/../lang', 'formforge');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'formforge');

        $this->publishes(array(
            __DIR__ . '/../lang' => $this->app->langPath('vendor/formforge'),
        ), 'formforge-langs');

        $this->publishes(array(
            __DIR__ . '/../config/formforge.php' => config_path('formforge.php'),
        ), 'formforge-config');

        $this->publishes(array(
            __DIR__ . '/../resources/views' => resource_path('views/vendor/formforge'),
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

        $this->commands(array(
            FormMakeCommand::class,
        ));

        $this->registerBladeDirectives();
    }

    public function registerBladeDirectives(): void
    {
        Blade::directive('formForgeScripts', fn () => view('formforge::scripts'));
    }
}
