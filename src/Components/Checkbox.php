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

        if (request()->old($name) !== null){
            $this->checked = request()->old($name)==='on' ? true:false;
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
