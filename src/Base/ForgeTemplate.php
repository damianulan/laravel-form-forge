<?php

namespace FormForge\Base;

use FormForge\Exceptions\TemplateNotExists;

class ForgeTemplate
{

    public static function getDefault(): string
    {
        return self::get(config('formforge.default'));
    }

    public static function getConfig(string $template): array
    {
        $templates = config('formforge.templates');

        if (!in_array($template, array_keys($templates))) {
            throw new TemplateNotExists();
        }

        return $templates;
    }

    public static function get(string $template): string
    {
        $templates = config('formforge.templates');

        if (!in_array($template, array_keys($templates))) {
            throw new TemplateNotExists();
        };

        return $template;
    }
}
