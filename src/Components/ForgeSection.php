<?php

namespace FormForge\Components;

use FormForge\FormBuilder;
use FormForge\Support\ComponentCollection;
use Illuminate\Support\Str;

class ForgeSection
{
    protected $id;

    protected string $title;

    protected ComponentCollection $components;

    public function __construct(string $title, FormBuilder $builder)
    {
        $this->components = new ComponentCollection();
        $this->id = 's_' . Str::random(10);
        $this->title = $title;
        $this->components = $builder->getComponents();
    }

    public function getComponents(): ComponentCollection
    {
        return $this->components;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getId(): string
    {
        return $this->id;
    }
}
