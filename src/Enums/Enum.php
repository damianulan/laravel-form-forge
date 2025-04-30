<?php

namespace FormForge\Enums;

class Enum
{
    public static function values()
    {
        $ref = new \ReflectionClass(static::class);
        return $ref->getConstants();
    }
}
