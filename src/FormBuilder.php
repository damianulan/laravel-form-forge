<?php

namespace FormForge;

use FormForge\Components\Button;
use Illuminate\Support\Str;
use FormForge\Components\ForgeComponent;
use FormForge\Enums\Template;
use Illuminate\View\View;
use FormForge\Exceptions\FormUnauthorized;
use Illuminate\Http\Request;
use FormForge\Base\Form;

/**
 * Collects components to render bootstrap form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 * @package FormForge
 */
class FormBuilder
{
    /**
     * Form id
     *
     * @var string|null
     */
    private ?string $id;

    /**
     * @var string|null
     */
    private ?string $title;

    /**
     * @var string
     */
    private string $method;

    /**
     * @var string|null
     */
    private ?string $action;

    /**
     * @var string
     */
    private string $template;

    /**
     * @var array
     */
    private array $classes = [];

    /**
     * @var array
     */
    private array $components = [];

    /**
     * @var array
     */
    private array $buttons = [];

    /**
     * @var \FormForge\Components\Button|null
     */
    public ?Button $submit = null;

    /**
     * @var \Illuminate\Http\Request
     */
    private Request $request;

    /**
     * Form internal constructor - in order to call FormBuilder instance use FormBuilder::boot() method instead.
     *
     * @param \Illuminate\Http\Request $request
     * @param string                              $method - as of 'POST', 'PUT', 'GET', 'DELETE' etc.
     * @param string|null                         $action - leave empty if you want to use the form in AJAX 
     * @param string|null                         $id - form html id
     * @return \FormForge\FormBuilder
     */
    public function __construct(Request $request, string $method, ?string $action, ?string $id = null)
    {
        $this->request = $request;
        $this->method = Str::upper($method);
        $this->action = $action;
        $this->id = $id;
        $this->template = config('formforge.defaults.template');
        $this->authorize();
    }

    /**
     * Form constructor
     *
     * @param \Illuminate\Http\Request $request
     * @param string                              $method - as of 'POST', 'PUT', 'GET', 'DELETE' etc.
     * @param string|null                         $action - leave empty if you want to use the form in AJAX 
     * @param string|null                         $id - form's html id
     * @return \FormForge\FormBuilder
     */
    public static function boot(Request $request, string $method, ?string $action, ?string $id = null): self
    {
        return new self($request, $method, $action, $id);
    }

    /**
     * Core function handling form authorization checks.
     *
     * @return void
     */
    private function authorize(): void
    {
        $user = $this->request->user() ?? null;
        if (!$user) {
            $this->throwUnauthorized();
        }

        // backtrace callable Form source
        // in order to locate authorization method
        $trace = debug_backtrace();
        $namespace = $trace[3]['class'];

        // check source
        $instance = new $namespace();
        if (! ($instance instanceof Form)) {
            $this->throwUnauthorized();
        }

        $authorized = $namespace::authorize($this->request);
        if (!$authorized) {
            $this->throwUnauthorized();
        }
    }

    /**
     * Add cutom class to the form HTML representation.
     *
     * @param mixed ...$classes
     * @return \FormForge\FormBuilder
     */
    public function class(...$classes): self
    {
        if (!empty($classes)) {
            foreach ($classes as $class) {
                $this->classes[] = $class;
            }
        }
        return $this;
    }

    /**
     * Add new input component to the form.
     *
     * @param \FormForge\Components\ForgeComponent $component
     * @return \FormForge\FormBuilder
     */
    public function add(ForgeComponent $component): self
    {
        if ($component && $component->show === true) {
            $this->components[$component->name] = $component;
        }
        return $this;
    }

    public function addButton(Button $button): self
    {
        if ($button) {
            if ($button->isSubmit()) {
                $this->submit = $button;
            } else {
                $this->buttons[$button->title] = $button;
            }
        }
        return $this;
    }

    /**
     * Remove added input component from the form.
     *
     * @param string $name
     * @return \FormForge\FormBuilder
     */
    public function remove(string $name): self
    {
        if (isset($this->components[$name])) {
            unset($this->components[$name]);
        }
        return $this;
    }

    /**
     * Change default template for the form.
     *
     * @param string $template
     * @return \FormForge\FormBuilder
     */
    public function template(string $template): self
    {
        $instance = null;
        try {
            $instance = Template::from($template);
        } catch (\Throwable $e) {
            if (config('app.debug')) {
                throw $e;
            }
        }

        $this->template = $instance ?? $this->template;
        return $this;
    }

    private function getClasses()
    {
        return empty($this->classes) ? null : implode(' ', $this->classes);
    }

    /**
     * Add basic HTML form submit button.
     * When clicked, it executes form validation and submits the form.
     *
     * @param string $class
     * @return \FormForge\FormBuilder
     */
    public function addSubmit(string $class = 'btn-primary'): self
    {
        $this->submit = new Button(__('formforge::components.buttons.save'), 'submit', null, $class);
        return $this;
    }

    /**
     * Add form header.
     *
     * @param string $title
     * @return \FormForge\FormBuilder
     */
    public function addTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    /**
     * get form title/header
     *
     * @return string|null
     */
    public function title(): ?string
    {
        return $this->title;
    }

    /**
     * render form view with all components.
     *
     * @return \Illuminate\View\View
     */
    public function render(): View
    {
        return view('formforge::templates.' . $this->template, [
            'components'  => $this->components,
            'method'    => $this->method,
            'action'    => $this->action,
            'classes'   => $this->getClasses(),
            'id'        => $this->id,
            'template'  => $this->template,
            'submit'    => $this->submit,
            'buttons'   => $this->buttons,
        ]);
    }

    private function throwUnauthorized()
    {
        throw new FormUnauthorized();
    }

    /**
     * Get all form components.
     *
     * @return array
     */
    public function getComponents(): array
    {
        return $this->components;
    }
}
