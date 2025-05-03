<?php

namespace FormForge\Enums;

/**
 * This is custom 
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 * @package FormForge
 */
class Enum
{
    public static function values()
    {
        $ref = new \ReflectionClass(static::class);
        return $ref->getConstants();
    }
}
