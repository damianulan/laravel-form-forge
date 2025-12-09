<?php

namespace FormForge\Base;

use FormForge\Events\FormValidationFail;
use FormForge\FormBuilder;
use FormForge\Traits\RequestMutators;
use Illuminate\Database\Eloquent\Model;
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
    protected static array $backParams = [];

    /**
     * Provide form components definition returning an instance of FormBuilder.
     */
    abstract public function definition(): FormBuilder;

    /**
     * Provide laravel validation rules.
     */
    abstract public function validation(): array;

    public function boot(): static
    {
        return $this;
    }

    public function booted(): static
    {
        return $this;
    }

    public function setDefinition(): static
    {
        $this->builder = $this->definition();

        return $this;
    }

    public function setModel(Model $model): static
    {
        $this->model = $model;

        return $this->mutate($model->toArray())->setDefinition();
    }

    /**
     * Use this method to validate form data. It returns an array with result and message stack.
     */
    public function validateJson(): array
    {
        $validator = $this->validator();

        if ($validator->fails()) {
            FormValidationFail::dispatch($this, $validator->messages());

            return [
                'status' => 'error',
                'messages' => $validator->messages(),
            ];
        }

        return [
            'status' => 'ok',
            'messages' => $validator->messages(),
        ];
    }

    /**
     * Use this method to validate form data. When bumped into error it automatically redirects back.
     * Override $backRoute and $backParams to customize redirection target.
     */
    public function validate(): void
    {
        $validator = $this->validator();

        if ($validator->fails()) {
            FormValidationFail::dispatch(static::class, $validator->messages());
            if (static::$backRoute) {
                $to = route(static::$backRoute, static::$backParams);
                abort(Redirect::to($to)->withErrors($validator)->withInput());
            }
            abort(Redirect::back()->withErrors($validator)->withInput());
        }
    }

    /**
     * Returns a raw validator instance. Best for custom logic.
     */
    public function validator(): ValidatorInstance
    {
        return Validator::make($this->all(), $this->validation(), $this->messages(), $this->attributes());
    }

    public function getDefinition(): FormBuilder
    {
        return $this->builder;
    }

    /**
     * Custom laravel validation messages.
     */
    protected function messages(): array
    {
        return [];
    }

    /**
     * Custom laravel validation attributes.
     */
    protected function attributes(): array
    {
        $attributes = [];

        foreach ($this->builder->getComponents() as $component) {
            $attributes[$component->name] = $component->label;
        }

        return $attributes;
    }
}
