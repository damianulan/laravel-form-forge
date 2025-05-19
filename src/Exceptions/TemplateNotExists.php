<?php

namespace FormForge\Exceptions;

class TemplateNotExists extends \Exception
{
    public function __construct()
    {
        $message = 'Given template does not exist';
        $code = 500;
        parent::__construct($message, $code);
    }
}
