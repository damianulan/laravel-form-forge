<?php

namespace FormForge\Contracts;

use Illuminate\Contracts\Support\Renderable;

interface RenderableComponent
{
    /**
     * Renders the html representation of the Component.
     */
    public function render(): Renderable;

    /**
     * Renders input label to html.
     */
    public function getInfos(): ?string;

    /**
     * Renders input label to html.
     */
    public function getLabel(): ?Renderable;
}
