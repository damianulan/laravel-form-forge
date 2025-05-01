<?php

namespace FormForge\Exceptions;

use Exception;

class FormUnauthorized extends Exception
{
    protected $message = 'FormForge: Form authorization failed. Permission denied.';

    protected $code = 403;
}
