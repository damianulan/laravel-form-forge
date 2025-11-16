<?php

namespace FormForge\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

class FormUnauthorized extends HttpException
{
    protected $message;

    protected $code = 403;

    public function __construct()
    {
        $this->message = __('formforge::forms.exception.unauthorized');
        parent::__construct($this->code, $this->message, null, array(), $this->code);
    }
}
