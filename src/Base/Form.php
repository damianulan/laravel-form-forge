<?php

namespace FormForge\Base;

use Carbon\Carbon;
use Exception;
use FormForge\Events\FormValidationFail;
use FormForge\Events\FormValidationSuccess;
use FormForge\FormBuilder;
use FormForge\Traits\RequestMutators;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorInstance;

/**
 * Base class for full Form template.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 */
abstract class Form
{

    use RequestMutators;

    protected FormBuilder $builder;

    protected ?Model $model = null;

    /**
     * custom route key to redirect back to after form validation
     */
    protected static ?string $backRoute = null;

    /**
     * custom route params to redirect back to after form validation
     */
    protected static array $backParams = array();

    public function boot(): static
    {
        return $this;
    }

    public function booted(): static
    {
        dd($this);
        return $this;
    }

    public function setDefinition(): static
    {
        $this->builder = $this->definition();
        return $this;
    }

    /**
     * Provide form components definition returning an instance of FormBuilder.
     *
     * @param  mixed  $model
     */
    abstract public function definition(?Model $model = null): FormBuilder;

    /**
     * Provide laravel validation rules.
     */
    abstract public function validation(): array;

    /**
     * Use this method to validate form data. It returns an array with result and message stack.
     */
    public function validateJson(): array
    {
        $validator = $this->validator();

        if ($validator->fails()) {
            FormValidationFail::dispatch($this, $validator->messages());

            return array(
                'status' => 'error',
                'messages' => $validator->messages(),
            );
        }
        FormValidationSuccess::dispatch($this, $validator->messages());

        return array(
            'status' => 'ok',
            'messages' => $validator->messages(),
        );
    }

    /**
     * Use this method to validate form data. When bumped into error it automatically redirects back.
     * Override $backRoute and $backParams to customize redirection target.
     */
    public function validate(?string $model_id = null): void
    {
        $validator = $this->validator($model_id);

        if ($validator->fails()) {
            if (static::$backRoute) {
                $to = route(static::$backRoute, static::$backParams);
                FormValidationFail::dispatch($this, $validator->messages());
                abort(Redirect::to($to)->withErrors($validator)->withInput());
            }
            FormValidationFail::dispatch($this, $validator->messages());
            abort(Redirect::back()->withErrors($validator)->withInput());
        } else {
            FormValidationSuccess::dispatch($this, $validator->messages());
        }
    }

    /**
     * Returns a raw validator instance. Best for custom logic.
     */
    public function validator(): ValidatorInstance
    {
        return Validator::make($this->attributes, $this->validation(), $this->messages(), $this->attributes());
    }

    /**
     * Custom laravel validation messages.
     */
    protected function messages(): array
    {
        return array();
    }

    /**
     * Custom laravel validation attributes.
     */
    protected function attributes(): array
    {
        $attributes = array();

        foreach ($this->builder->getComponents() as $component) {
            $attributes[$component->name] = $component->label;
        }

        return $attributes;
    }

    public function getDefinition(): FormBuilder
    {
        return $this->builder;
    }

}
