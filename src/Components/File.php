<?php

namespace FormForge\Components;

class File extends ForgeComponent
{
    public string $name;

    public bool $multiple = false;

    public bool $hasValue = false;

    private array $accept = array();

    public function __construct(string $name, bool $hasValue)
    {
        $this->name = empty($name) ? null : $name;
        $this->classes[] = 'form-control';
        $this->classes[] = 'formforge-control';
        $this->hasValue = $hasValue;
    }

    public function setExt(array $accepts)
    {
        foreach ($accepts as $accept) {
            $this->accept[] = $accept;
        }

        return $this;
    }

    public function getExt()
    {
        if (count($this->accept)) {
            return implode(',', $this->accept);
        }

        return null;
    }

    public function multiple()
    {
        $this->multiple = true;

        return $this;
    }
}
