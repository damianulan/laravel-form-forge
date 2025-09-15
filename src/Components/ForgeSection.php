<?php

namespace FormForge\Components;

use Closure;
use FormForge\FormBuilder;
use Illuminate\Support\Str;
use Illuminate\View\View;

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
