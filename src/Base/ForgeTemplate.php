<?php

namespace FormForge\Base;

use FormForge\Enums\ForgeTemplate as Template;
use FormForge\Exceptions\TemplateNotExists;

class ForgeTemplate
{
    public static function getDefault(): string
    {
        return self::get(config('formforge.default'));
    }

    public static function getConfig(string $template): array
    {
        $templates = array_map(fn ($template) => $template->value, Template::cases());

        if ( ! in_array($template, array_keys($templates))) {
            throw new TemplateNotExists($template);
        }

        return $templates;
    }

    public static function get(string $template): string
    {
        $templates = Template::tryFrom($template);

        if ( ! $templates) {
            throw new TemplateNotExists($template);
        }

        return $template;
    }
}
