<?php

namespace FormForge\Exceptions;

class FormUnauthorized extends \Exception
{
    protected $message;

    public function __construct()
    {
        parent::__construct(__('formforge::forms.exception.unauthorized'), 403);
    }
}
