<?php

namespace FormForge\Exceptions;

class ForgeCollectionIllegalInput extends \Exception
{
    public function __construct()
    {
        parent::__construct('ForgeCollection accepts only ForgeComponent and ForgeSection instances');
    }
}
