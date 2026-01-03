<?php

namespace FormForge\Components;

use Illuminate\View\View;

class Daterange extends ForgeComponent
{
    public string $name;

    public array $components = [];

    /**
     * Make one input with dateranges.
     * WARNING: this component is not fully implemented and tested yet.
     */
    public function __construct(string $name, string $type, array $values = [])
    {
        $this->name = empty($name) ? null : $name;
        $this->components = [
            (new Datetime($name . '_from', $type, $values['from'] ?? null))->placeholder(__('formforge::forms.placeholders.choose_daterange_from')),
            (new Datetime($name . '_to', $type, $values['to'] ?? null))->placeholder(__('formforge::forms.placeholders.choose_daterange_to')),
        ];
    }

    final public function render(): View
    {
        return view('formforge::components.daterange', [
            'components' => $this->components,
        ]);
    }
}
