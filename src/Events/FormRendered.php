<?php

namespace FormForge\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FormRendered
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param  mixed  $components
     */
    public function __construct(
        public string $form,
        public string $method,
        public $components
    ) {}
}
