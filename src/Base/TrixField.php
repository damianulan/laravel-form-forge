<?php

namespace FormForge\Base;

use Mews\Purifier\Facades\Purifier;

class TrixField
{
    private string $value;

    public function setValue($value)
    {
        $this->value = Purifier::clean($value);
        return $this;
    }

    public function stripFormat()
    {
        return strip_tags($this->value);
    }

    public function get()
    {
        return $this->value;
    }

    public function __toString()
    {
        return $this->value;
    }
}
