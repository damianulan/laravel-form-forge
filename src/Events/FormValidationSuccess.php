<?php

namespace FormForge\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FormValidationSuccess
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @param  mixed  $messages
     */
    public function __construct(public string $form, public $messages) {}
}
