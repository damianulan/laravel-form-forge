<?php

namespace FormForge\Components;

use FormForge\FormBuilder;

class ForgeSection
{
    public string $title;

    public array $components = [];

    public function __construct(string $title, FormBuilder $builder)
    {
        $this->title = $title;
        $this->components = $builder->getComponents();
    }
}
