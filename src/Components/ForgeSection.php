<?php

namespace FormForge\Components;

use FormForge\FormBuilder;
use Illuminate\Support\Str;

class ForgeSection
{
    public $id;

    public string $title;

    public array $components = array();

    public function __construct(string $title, FormBuilder $builder)
    {
        $this->id = 's_' . Str::random(10);
        $this->title = $title;
        $this->components = $builder->getComponents();
    }
}
