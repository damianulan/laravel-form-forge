<?php

namespace FormForge\Base;

use FormForge\Events\FormValidationFail;
use FormForge\FormBuilder;
use FormForge\Traits\RequestMutators;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorInstance;
use FormForge\Helpers\Config;

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

    protected $attributes = [];

    protected $fillable = [];

    protected FormBuilder $builder;

    protected ?Model $model = null;

    protected bool $booted = false;

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
    abstract public function definition(FormBuilder $builder): FormBuilder;

    /**
     * Provide laravel validation rules.
     */
    abstract public function validation(): array;

    /**
     * Boot with attributes located in the request
     *
     * @param \Illuminate\Http\Request|null $request
     * @return static
     */
    public static function bootWithRequest(? Request $request = null): static
    {
        $inputs = [];
        if($request){
            $inputs = $request->all();
        }
        else {
            $inputs = RequestFacade::all();
        }

        return (new static())->boot()->mutate($inputs)->setDefinition()->booted();
    }

    /**
     * Boot with attributes passed in an assoc array and current request attributes in that order.
     *
     * @param array $attributes
     * @return static
     */
    public static function bootWithAttributes(array $attributes = []): static
    {
        return (new static())->boot()->mutate($attributes)
                        ->mutate(RequestFacade::all(), true)
                        ->setDefinition()
                        ->booted();
    }

    /**
     * Boot with attributes from a model and current request attributes in that order.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @return static
     */
    public static function bootWithModel(Model $model): static
    {
        $instance = (new static())->boot();
        $instance->model = $model;
        return $instance->mutate($model->toArray())
                        ->mutate(RequestFacade::all(), true)
                        ->setDefinition()
                        ->booted();
    }

    public function boot(): static
    {
        return $this;
    }

    public function booted(): static
    {
        $this->booted = true;
        return $this;
    }

    public function setDefinition(bool $force = false): static
    {
        if($force || !isset($this->builder)) {
            $builder = (new FormBuilder())
                ->setFormName(static::class);

            $this->builder = $this->definition($builder);
        }

        return $this;
    }

    /**
     * Set model to form instance. This method gets all model's attributes and assigns them to this form instance as its own attributes.
     * It does not override existing attributes assigned with request nor else.
     *
     * @param \Illuminate\Database\Eloquent\Model|null $model
     * @return static
     */
    public function setModel(?Model $model = null): static
    {
        if($model){
            $this->model = $model;
            return $this->mutate($model->toArray())->setDefinition(true);
        }

        return $this;
    }

    /**
     * Use this method to validate form data. It returns an array with result and message stack.
     */
    public function validateJson(): array
    {
        $validator = $this->validator();

        if ($validator->fails()) {
            if (Config::dispatchesEvents()) {
                FormValidationFail::dispatch($this, $validator->messages());
            }

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
            if (Config::dispatchesEvents()) {
                FormValidationFail::dispatch($this, $validator->messages());
            }
            if (static::$backRoute) {
                $to = route(static::$backRoute, static::$backParams);
                abort(Redirect::to($to)->withErrors($validator)->withInput());
            }
            abort(Redirect::back()->withErrors($validator)->withInput());
        }
    }

    /**
     * Check whether form fails declared validation
     *
     * @return bool
     */
    public function fails(): bool
    {
        return $this->validator()->fails();
    }

    /**
     * Check whether form passes declared validation
     *
     * @return bool
     */
    public function passes(): bool
    {
        return $this->validator()->passes();
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
        if(!isset($this->builder)){
            $this->builder = $this->definition(new FormBuilder);
        }
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
