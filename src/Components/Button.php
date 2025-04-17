<?php

namespace FormForge\Components;

use Exception;
use Illuminate\Support\Facades\View as ViewFacade;
use Illuminate\View\View;

class Button
{
    public string $type;
    public string $class;
    public string $title;

    public function __construct(string $title, string $type = 'button', string $class = 'btn-primary')
    {
        $allowed_types = ['button', 'submit', 'reset'];
        if (in_array($type, $allowed_types)) {
            $this->type = $type;
        }

        $this->class = $class;
        $this->title = $title;
    }

    public function render(): View
    {
        return ViewFacade::make('formforge::components.button', [
            'component' => $this,
        ]);
    }
}
