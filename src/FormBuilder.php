<?php

namespace FormForge;

use Closure;
use FormForge\Base\ForgeTemplate;
use FormForge\Components\Button;
use FormForge\Components\ForgeComponent;
use FormForge\Components\ForgeSection;
use FormForge\Contracts\RenderableComponent;
use FormForge\Events\FormRendered;
use FormForge\Events\FormRendering;
use FormForge\Exceptions\FormUnauthorized;
use FormForge\Support\Collections\ComponentCollection;
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
     * Form html id
     */
    private string $id;

    private ?string $title = null;

    private string $method;

    private ?string $action = null;

    private string $template;

    private array $classes = [];

    private ComponentCollection $components;

    private array $buttons = [];

    private bool $authorized = true;

    /**
     * Form origin namespace
     */
    private string $form;

    /**
     * Form internal constructor - in order to call FormBuilder instance use FormBuilder::boot() method instead.
     */
    public function __construct()
    {
        $this->components = new ComponentCollection();
        $this->method = 'POST';
        $this->id = Str::random(10);
        $this->template = ForgeTemplate::get(config('formforge.default'));
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
     * Set HTML form id
     */
    public function setId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Set form method
     */
    public function setMethod(string $method): self
    {
        $method = Str::upper($method);

        if ( ! in_array($method, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])) {
            throw new InvalidFormMethod($method);
        }
        $this->method = $method;

        return $this;
    }

    public function setAction(string $action): self
    {
        $this->action = $action;

        return $this;
    }

    /**
     * Change default template for the form.
     */
    public function setTemplate(string $template): self
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
     * Add new input component to the form.
     */
    public function add(?RenderableComponent $component, ?Closure $condition = null): self
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
        $fb = $callback(self::recreate($this));

        $section = new ForgeSection($title, $fb);

        $this->components->put($section->getId(), $section);

        return $this;
    }

    /**
     * Allows to modify your FormBuilder instance based on given condition.
     * Callback accepts FormBuilder $builder as argument.
     *
     * @param  bool  $condition  - when false, callback won't be executed
     * @param  Closure  $then  - function($builder)
     */
    public function when(bool $condition, Closure $then): self
    {
        $instance = $this;
        if ($condition) {
            $then($instance);
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
    public function setTitle(string $title): self
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

        return view('formforge::templates.' . $this->template, [
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
        ]);
    }

    /**
     * render form view with all components.
     */
    public function scripts(): View
    {
        return view('formforge::form_script', [
            'id' => $this->id,
        ]);
    }

    /**
     * Get all form components.
     */
    public function getComponents(): ComponentCollection
    {
        return $this->components->getComponents();
    }

    /**
     * Get form class namespace, from where this form builder was called.
     */
    public function getFormName(): string
    {
        return $this->form;
    }

    /**
     * Register static class name for this instance.
     */
    public function setFormName(string $class): self
    {
        $this->form = $class;

        return $this;
    }

    protected static function recreate(self $instance): self
    {
        $new = new static();
        $new->id = $instance->id;
        $new->action = $instance->action;

        return $new;
    }

    /**
     * Get HTML classlist
     */
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
