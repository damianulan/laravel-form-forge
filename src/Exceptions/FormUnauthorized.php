<?php

namespace FormForge\Exceptions;

use Exception;

class FormUnauthorized extends Exception
{
    protected $message;

    public function __construct()
    {
        parent::__construct(__('formforge::forms.exception.unauthorized'), 403);
    }
}
