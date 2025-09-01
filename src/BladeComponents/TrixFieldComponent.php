<?php

namespace FormForge\BladeComponents;

use Illuminate\View\Component;
use Illuminate\View\View;

class TrixFieldComponent extends Component
{
    /**
     * Create the component instance.
     */
    public function __construct(
        public string $id,
        public string $name,
        public string $toolbar,
        public string $value = '',
    ) {}

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        return view('formforge::components.trix-field');
    }
}
