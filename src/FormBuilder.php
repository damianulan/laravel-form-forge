<?php

namespace FormForge;

use FormForge\Components\Button;
use Illuminate\Support\Str;
use FormForge\Components\Component;
use FormForge\Enums\Template;

/**
 * Collects components to render bootstrap form.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 */
class FormBuilder
{
    private ?string $id;
    private ?string $title;
    private string $method;
    private ?string $action;
    private string $template = Template::HORIZONTAL;

    private array $classes = [];
    private array $components = [];

    public ?Button $submit = null;

    public function __construct(string $method, ?string $action, ?string $id = null)
    {
        $this->method = Str::upper($method);
        $this->action = $action;
        $this->id = $id;
    }

    public static function boot(string $method, ?string $action, ?string $id = null): self
    {
        return new self($method, $action, $id);
    }

    public function class(...$classes)
    {
        if (!empty($classes)) {
            foreach ($classes as $class) {
                $this->classes[] = $class;
            }
        }
        return $this;
    }

    public function add(Component $component)
    {
        if (!empty($component) && $component->show === true) {
            $this->components[$component->name] = $component;
        }
        return $this;
    }

    public function remove(string $name)
    {
        if (isset($this->components[$name])) {
            unset($this->components[$name]);
        }
        return $this;
    }

    public function template(string $template)
    {
        $this->template = empty($template) ? $this->template : $template;
        return $this;
    }

    private function getClasses()
    {
        return empty($this->classes) ? null : implode(' ', $this->classes);
    }

    public function addSubmit(string $class = 'btn-primary')
    {
        $this->submit = new Button(__('buttons.save'), 'submit', $class);
        return $this;
    }

    public function addTitle(string $title)
    {
        $this->title = $title;
        return $this;
    }

    public function title(): ?string
    {
        return $this->title;
    }

    public function render()
    {
        return view('components.forms.templates.' . $this->template, [
            'components'  => $this->components,
            'method'    => $this->method,
            'action'    => $this->action,
            'classes'   => $this->getClasses(),
            'id'        => $this->id,
            'template'  => $this->template,
            'submit'    => $this->submit,
        ]);
    }
}
