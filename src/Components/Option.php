<?php

namespace FormForge\Components;

class Option
{
    public $value;
    public $content;

    public bool $disabled = false;

    public function __construct($value, $content)
    {
        $this->value = $value;
        $this->content = $content;
    }

    public function disable()
    {
        $this->disabled = true;
        return $this;
    }
}