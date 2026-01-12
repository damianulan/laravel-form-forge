<?php

namespace FormForge\Exceptions;

use Exception;

class InvalidFormMethod extends Exception
{
    public function __construct($method = null)
    {

        parent::__construct("Invalid form method: '{$method}'.", 500);
    }
}
