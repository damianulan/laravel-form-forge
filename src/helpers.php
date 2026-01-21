<?php

use Mews\Purifier\Facades\Purifier;

if ( ! function_exists('purify_html')) {

    /**
     * Uses mews/purifier custom setup to clean HTML input off of possible XSS vulnerabilities
     * Best suited for cleaning before placing in rich text editors
     */
    function purify_html(?string $input): string
    {
        if ($input) {
            return Purifier::clean($input, 'formforge_config');
        }

        return '';
    }
}
