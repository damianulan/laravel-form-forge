<?php

namespace FormForge\Components;

use FormForge\Components\Datetime;
use Illuminate\View\View;
use FormForge\Components\ForgeComponent;

class Daterange extends ForgeComponent
{

    public string $name;
    public array $components = [];

    /**
     * Make one input with dateranges.
     * WARNING: this component is not fully implemented and tested yet.
     *
     * @param string $name
     * @param string $type
     * @param array  $values
     */
    public function __construct(string $name, string $type, array $values = [])
    {
        $this->name = empty($name) ? null : $name;
        $this->components = [
            (new Datetime($name . '_from', $type, $values['from']))->placeholder(__('formforge::forms.placeholders.choose_daterange_from')),
            (new Datetime($name . '_to', $type, $values['to']))->placeholder(__('formforge::forms.placeholders.choose_daterange_to')),
        ];
    }

    final public function render(): View
    {
        return view('formforge::components.daterange', [
            'components' => $this->components,
        ]);
    }
}
