<?php

namespace FormForge\Helpers;

use Illuminate\Support\Str;

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

    public static function personstampsFieldType(): string
    {
        $setting = config('formforge.personstamps.type','bigInteger');
        if(Str::contains($setting, 'uuid', true)){
            return 'foreignUuid';
        }
        return 'foreignId';
    }
}
