<?php

namespace FormForge;

use Closure;
use FormForge\Base\ForgeTemplate;
use FormForge\Base\Form;
use FormForge\Components\Button;
use FormForge\Components\ForgeComponent;
use FormForge\Components\ForgeSection;
use FormForge\Events\FormRendered;
use FormForge\Events\FormRendering;
use FormForge\Exceptions\FormUnauthorized;
use FormForge\Support\ComponentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Collects components to render bootstrap form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 */
class FormBuilder
{
    public ?Button $submit = null;

    /**
     * Form id
     */
    private ?string $id;

    private ?string $title;

    private string $method;

    private ?string $action;

    private string $template;

    private array $classes = array();

    private ComponentCollection $components;

    private array $buttons = array();

    private Request $request;

    private bool $authorized = true;

    /**
     * Form origin namespace
     */
    private string $form;

    /**
     * Form internal constructor - in order to call FormBuilder instance use FormBuilder::boot() method instead.
     *
     * @param  string  $method  - as of 'POST', 'PUT', 'GET', 'DELETE' etc.
     * @param  string|null  $action  - leave empty if you want to use the form in AJAX
     * @param  string|null  $id  - form html id
     * @return FormBuilder
     */
    public function __construct(Request $request, string $method, ?string $action, ?string $id = null)
    {
        $this->components = new ComponentCollection();
        $this->request = $request;
        $this->method = Str::upper($method);
        $this->action = $action;
        $this->id = $id ?? Str::random(10);
        $this->template = ForgeTemplate::get(config('formforge.default'));
        $this->validate();
    }

    /**
     * Form constructor
     *
     * @param  string  $method  - as of 'POST', 'PUT', 'GET', 'DELETE' etc.
     * @param  string|null  $action  - leave empty if you want to use the form in AJAX
     * @param  string|null  $id  - form's html id
     */
    public static function boot(Request $request, string $method, ?string $action, ?string $id = null): self
    {
        return new self($request, $method, $action, $id);
    }

    /**
     * Add cutom class to the form HTML representation.
     *
     * @param  string[]  $classes
     */
    public function class(string ...$classes): self
    {
        if ( ! empty($classes)) {
            foreach ($classes as $class) {
                $this->classes[] = $class;
            }
        }

        return $this;
    }

    /**
     * Add new input component to the form.
     */
    public function add(ForgeComponent $component, ?Closure $condition = null): self
    {
        $cond = is_null($condition) || $condition() ? true : false;
        if ($component && true === $component->show && $cond) {
            $this->components->put($component->name, $component);
        }

        return $this;
    }

    /**
     * Section of components with a header.
     */
    public function addSection(string $title, Closure $callback): self
    {
        $fb = $callback(new FormBuilder($this->request, $this->method, $this->action, $this->id));

        $section = new ForgeSection($title, $fb);

        $this->components->put($section->getId(), $section);

        return $this;
    }

    /**
     * Add button at the bottom of the form.
     */
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
     */
    public function remove(string $name): self
    {
        $this->components->forget($name);

        return $this;
    }

    /**
     * Change default template for the form.
     */
    public function template(string $template): self
    {
        $instance = ForgeTemplate::get($template);

        $this->template = $instance ?? $this->template;

        return $this;
    }

    /**
     * Add basic HTML form submit button.
     * When clicked, it executes form validation and submits the form.
     */
    public function addSubmit(string $class = 'btn-primary'): self
    {
        $this->submit = new Button(__('formforge::components.buttons.save'), 'submit', null, $class);

        return $this;
    }

    /**
     * Allows to modify your FormBuilder instance based on given condition.
     * Callback accepts FormBuilder $builder as argument.
     *
     * @param  bool  $condition  - when false, callback won't be executed
     * @param  Closure  $callback  - function($builder)
     */
    public function onCondition(bool $condition, Closure $callback): self
    {
        $instance = $this;
        if ($condition) {
            $callback($instance);
        }

        return $instance;
    }

    /**
     * Check permissions and conditions to show this form to a user, using callback.
     * Use only once per form builder instance.
     *
     * @param  Closure  $callback  - should return boolean
     */
    public function authorize(Closure $callback): self
    {
        $this->authorized = (bool) $callback();
        if ( ! $this->authorized) {
            $this->throwUnauthorized();
        }

        return $this;
    }

    /**
     * Add form header.
     */
    public function addTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * get form title/header
     */
    public function title(): ?string
    {
        return $this->title;
    }

    /**
     * render form view with all components.
     */
    public function render(): View
    {
        if (config('formforge.dispatches_events')) {
            FormRendering::dispatch($this->form, $this->method, $this->components);
        }

        return view('formforge::templates.' . $this->template, array(
            'components' => $this->components,
            'method' => $this->method,
            'action' => $this->action,
            'classes' => $this->getClasses(),
            'id' => $this->id,
            'template' => $this->template,
            'submit' => $this->submit,
            'buttons' => $this->buttons,
            'form' => $this->form,
            'event' => FormRendered::class,
        ));
    }

    /**
     * Get all form components.
     */
    public function getComponents(): ComponentCollection
    {
        return $this->components->getComponents();
    }

    /**
     * Get form class namespac, from where this form builder was called.
     */
    public function getFormName(): string
    {
        return $this->form;
    }

    /**
     * Detect form object
     */
    private function validate(): void
    {
        $user = $this->request->user() ?? null;
        if ( ! $user) {
            $this->throwUnauthorized();
        }

        // backtrace callable Form source
        // in order to locate authorization method
        $trace = debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 4);
        $namespace = $trace[3]['class'];

        // check source
        $instance = new $namespace();
        if ( ! ($instance instanceof Form)) {
            $this->throwUnauthorized();
        }

        $this->form = $namespace;
    }

    private function getClasses()
    {
        return empty($this->classes) ? null : implode(' ', $this->classes);
    }

    /**
     * Throwing FormUnauthorized exception.
     *
     * @throws FormUnauthorized
     */
    private function throwUnauthorized(): void
    {
        throw new FormUnauthorized();
    }
}
