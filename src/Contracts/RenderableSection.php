<?php

namespace FormForge\Contracts;

use FormForge\Support\Collections\ComponentCollection;

interface RenderableSection
{
    /**
     * Gets section components
     *
     * @return \FormForge\Support\Collections\ComponentCollection
     */
    public function getComponents(): ComponentCollection;

    /**
     * Gets section header
     *
     * @return string
     */
    public function getTitle(): string;

    /**
     * Gets unique section identifier (script purposes)
     *
     * @return string
     */
    public function getId(): string;
}
