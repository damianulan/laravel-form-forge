<?php

namespace FormForge\Components;

use FormForge\Base\TrixField;

class Trix extends ForgeComponent
{

    public string $name;
    public ?string $value = null;
    public string $toolbar;

    public function __construct(string $name, string $toolbar = 'short', ?TrixField $value = null)
    {
        $this->name = empty($name) ? null:$name;
        $this->value = $value ? $value->get():null;
        $this->toolbar = $toolbar;
    }
}
