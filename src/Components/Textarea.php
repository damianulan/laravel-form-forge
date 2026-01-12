<?php

namespace FormForge\Components;

class Textarea extends ForgeComponent
{
    public string $name;

    public ?string $value = null;

    public ?int $rows = null;

    public ?int $cols = null;

    public bool $resize = true;

    public function __construct(string $name, ?string $value)
    {
        $this->name = empty($name) ? null : $name;
        $this->value = $value;
        if (request()->old($name) !== null) {
            $this->value = request()->old($name);
        }
        $this->purifyValue();
        $this->classes[] = 'form-control';
        $this->classes[] = 'formforge-control';
        $this->classes[] = 'formforge-textarea';
    }

    public function rows(int $value)
    {
        $this->rows = $value;

        return $this;
    }

    public function cols(int $value)
    {
        $this->cols = $value;

        return $this;
    }

    public function resize(bool $value = true)
    {
        $this->resize = $value;

        return $this;
    }
}
