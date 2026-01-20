<?php

namespace FormForge\Components;

class Checkbox extends ForgeComponent
{
    public string $name;

    public string $type;

    public ?bool $checked = null;

    public function __construct(string $name, string $type, ?bool $checked = null)
    {
        $this->name = empty($name) ? null : $name;
        $this->type = empty($type) ? null : $type;
        $this->checked = $checked;

        if (null !== request()->old($name)) {
            $this->checked = 'on' === request()->old($name) ? true : false;
        }
    }

    final public function default(bool $checked)
    {
        if (is_null($this->checked)) {
            $this->checked = $checked;
        }

        return $this;
    }
}
