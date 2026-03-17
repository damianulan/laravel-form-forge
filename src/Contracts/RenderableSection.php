<?php

namespace FormForge\Contracts;

use FormForge\Support\Collections\ComponentCollection;

interface RenderableSection
{
    /**
     * Gets section components
     */
    public function getComponents(): ComponentCollection;

    /**
     * Gets section header
     */
    public function getTitle(): string;

    /**
     * Gets unique section identifier (script purposes)
     */
    public function getId(): string;
}
