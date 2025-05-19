<?php

namespace FormForge\Exceptions;

class TemplateNotExists extends \Exception
{
    public function __construct(string $template)
    {
        $message = "Given template '$template' does not exist";
        $code = 500;
        parent::__construct($message, $code);
    }
}
