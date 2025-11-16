<?php

namespace FormForge\Components;

use Illuminate\Support\Collection;

class Select extends ForgeComponent
{
    public string $name;

    public array $values = array();

    public Collection $options;

    public bool $multiple = false;

    public bool $empty_field = true;

    /**
     * Simple select component instance.
     */
    public function __construct(string $name, Collection $options, array $selected_values = array())
    {
        $this->name = empty($name) ? null : $name;
        if (count($selected_values)) {
            $this->values = $selected_values;
        }
        $this->options = $options;
    }

    public function multiple()
    {
        $this->multiple = true;
        $this->classes[] = 'formforge-control select-multiple';

        return $this;
    }

    public function noEmpty()
    {
        $this->empty_field = false;

        return $this;
    }
}
