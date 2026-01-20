<?php

namespace FormForge\Exceptions;

use Exception;

class InvalidParameterType extends Exception
{
    public function __construct(string $message)
    {
        parent::__construct($message, 500);
    }
}
