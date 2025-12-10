<?php

namespace FormForge\Helpers;

class Config
{
    public static function debugging(): bool
    {
        return config('app.debug') ?? false;
    }

    public static function dispatchesEvents(): bool
    {
        return config('formforge.dispatches_events') ?? false;
    }
}
