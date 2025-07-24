<?php

namespace FormForge\Components;

use Illuminate\Support\Facades\URL;
use Illuminate\View\View;

class Button
{
    public ?string $type;

    public string $class;

    public ?string $href;

    public string $title;

    public bool $disabled = false;

    /**
     * Generate a delete button. Provide href or use ".btn-delete" class to specify behavior in JS.
     */
    public static function delete(?string $title = null, ?string $href = null, string $classes = 'btn-danger'): self
    {
        if (empty($title)) {
            $title = __('formforge::components.buttons.delete');
        }
        $classes .= ' btn-delete';
        $type = 'button';
        if ($href) {
            $type = 'a';
        }

        return new self($title, $type, $href, $classes);
    }

    /**
     * Generate a redirect back button.
     */
    public static function back(?string $title = null, string $classes = 'btn-secondary'): self
    {
        if (empty($title)) {
            $title = __('formforge::components.buttons.back');
        }
        $href = URL::previous();

        return new self($title, 'a', $href, $classes);
    }

    /**
     * Generate a reset button.
     */
    public static function reset(?string $title = null, string $classes = 'btn-secondary'): self
    {
        if (empty($title)) {
            $title = __('formforge::components.buttons.reset');
        }

        return new self($title, 'reset', null, $classes);
    }

    /**
     * Generate a submit button.
     */
    public static function submit(?string $title = null, string $classes = 'btn-primary'): self
    {
        if (empty($title)) {
            $title = __('formforge::components.buttons.save');
        }

        return new self($title, 'submit', null, $classes);
    }

    /**
     * Add a button to the form.
     * Allowed types: a, button, submit, reset
     *
     * @param  string|null  $href  - only when type is 'a'
     */
    public function __construct(string $title, string $type = 'button', ?string $href = null, string $classes = 'btn-primary')
    {
        $allowed_types = ['a', 'button', 'submit', 'reset'];
        if ($href) {
            $type = 'a';
        }
        $this->type = null;

        if (in_array($type, $allowed_types)) {
            $this->type = $type;
        }
        $this->href = $href;

        $this->class = 'btn formforge-btn '.$classes;
        $this->title = $title;
    }

    public function isSubmit(): bool
    {
        return $this->type === 'submit';
    }

    /**
     * Marks a Component as disabled.
     */
    public function disabled(): self
    {
        $this->disabled = true;

        return $this;
    }

    /**
     * render button view with all components.
     */
    public function render(): View
    {
        return view('formforge::components.button', [
            'component' => $this,
        ]);
    }
}
