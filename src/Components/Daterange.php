<?php

namespace FormForge\Components;

use FormForge\Components\Datetime;
use Illuminate\Support\Facades\View as ViewFacade;
use Illuminate\View\View;
use FormForge\Components\ForgeComponent;

class Daterange extends ForgeComponent
{

    public string $name;
    public array $components = [];

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
        return ViewFacade::make('formforge::components.daterange', [
            'components' => $this->components,
        ]);
    }
}
