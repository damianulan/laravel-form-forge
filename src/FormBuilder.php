<?php

namespace FormForge;

use FormForge\Components\Button;
use Illuminate\Support\Str;
use FormForge\Components\ForgeComponent;
use FormForge\Enums\Template;
use Illuminate\View\View;
use Illuminate\Support\Facades\Request;
use FormForge\Exceptions\FormUnauthorized;

/**
 * Collects components to render bootstrap form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
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
     * @var \FormForge\Components\Button|null
     */
    public ?Button $submit = null;

    /**
     * @var \Illuminate\Support\Facades\Request
     */
    private Request $request;

    /**
     * Form constructor
     *
     * @param \Illuminate\Support\Facades\Request $request
     * @param string                              $method
     * @param string|null                         $action
     * @param string|null                         $id
     * @return \FormForge\FormBuilder
     */
    public function __construct(Request $request, string $method, ?string $action, ?string $id = null)
    {
        $this->request = $request;
        $this->method = Str::upper($method);
        $this->action = $action;
        $this->id = $id;
        $this->template = config('formforge.default_template');
        $this->authorize();
    }

    /**
     * Form constructor
     *
     * @param \Illuminate\Support\Facades\Request $request
     * @param string                              $method
     * @param string|null                         $action
     * @param string|null                         $id
     * @return \FormForge\FormBuilder
     */
    public static function boot(Request $request, string $method, ?string $action, ?string $id = null): self
    {
        return new self($request, $method, $action, $id);
    }

    private function authorize()
    {
        $user = $this->request->user() ?? null;
        if (!$user) {
            $this->throwUnauthorized();
        }
        $trace = debug_backtrace();
        $class = $trace[1]['class'];
        dd($class);
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
        if (!empty($component) && $component->show === true) {
            $this->components[$component->name] = $component;
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
        $template = Str::upper($template);
        $this->template = Template::$template ?? $this->template;
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
     * @return self
     */
    public function addSubmit(string $class = 'btn-primary'): self
    {
        $this->submit = new Button(__('formforge::components.buttons.save'), 'submit', $class);
        return $this;
    }

    /**
     * Add form header.
     *
     * @param string $title
     * @return self
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
        ]);
    }

    private function throwUnauthorized()
    {
        throw new FormUnauthorized();
    }
}
