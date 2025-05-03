<?php

namespace FormForge\Base;

use Mews\Purifier\Facades\Purifier;

class TrixField
{
    private string $value;

    /**
     * Set value of the trix field
     *
     * @param mixed $value
     * @return void
     */
    public function setValue($value)
    {
        $this->value = Purifier::clean($value);
        return $this;
    }

    /**
     * Strip html tags from field value.
     *
     * @return void
     */
    public function stripFormat()
    {
        return strip_tags($this->value);
    }

    /**
     * Get trix value for view.
     *
     * @return void
     */
    public function get()
    {
        return Purifier::clean($this->value);
    }

    public function __toString()
    {
        return $this->value;
    }
}
