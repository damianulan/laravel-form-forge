<?php

namespace FormForge\Components;

use Exception;
use Illuminate\View\View;

class Button
{
    public string $type;
    public string $class;
    public string $title;

    /**
     * Add a button to the form.
     *
     * @param string $title
     * @param string $type
     * @param string $class
     */
    public function __construct(string $title, string $type = 'button', string $class = 'btn-primary')
    {
        $allowed_types = ['button', 'submit', 'reset'];
        if (in_array($type, $allowed_types)) {
            $this->type = $type;
        }

        $this->class = $class;
        $this->title = $title;
    }

    /**
     * render button view with all components.
     *
     * @return \Illuminate\View\View
     */
    public function render(): View
    {
        return view('formforge::components.button', [
            'component' => $this,
        ]);
    }
}
