<?php

namespace FormForge\Components;

class Container extends ForgeComponent
{
    public string $name;

    public ?string $value = null;

    public function __construct(string $name, ?string $value)
    {
        $this->name = empty($name) ? null : $name;
        $this->value = $value;
        if (request()->old($name) !== null) {
            $this->value = request()->old($name);
        }
        $this->classes[] = 'formforge-container';
    }
}
