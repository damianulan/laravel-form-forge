<?php

namespace FormForge\Components;

class Datetime extends ForgeComponent
{
    public string $name;

    public string $type;

    public ?string $value = null;

    public ?string $minDate = null;

    public ?string $maxDate = null;

    /**
     * Create a date/time/datetime input.
     */
    public function __construct(string $name, string $type, ?string $value, ?string $minDate = null, ?string $maxDate = null)
    {
        $this->name = empty($name) ? null : $name;
        $this->type = empty($type) ? null : $type;
        $this->minDate = empty($minDate) ? null : $minDate;
        $this->maxDate = empty($maxDate) ? null : $maxDate;

        if (request()->old($name)) {
            $this->value = date($this->getFormat(), strtotime(request()->old($name)));
        }
        if ( ! $this->value) {
            $this->value = empty($value) ? null : date($this->getFormat(), strtotime($value));
        }

        $this->classes[] = 'form-control';
        $this->classes[] = 'formforge-control';

        if ($this->type) {
            $this->classes[] = $this->type . 'picker';
        }
        $this->placeholder(__('formforge::forms.placeholders.choose_' . $this->type));
    }

    /**
     * Set minimum accessible date for the input.
     */
    public function minDate(string $date): self
    {
        $this->minDate = $date;

        return $this;
    }

    /**
     * Set maximum accessible date for the input.
     */
    public function maxDate(string $date): self
    {
        $this->maxDate = $date;

        return $this;
    }

    public function getFormat(): string
    {
        $format = config('formforge.date_format') . ' H:i:s';
        if ('date' === $this->type || 'birthdate' === $this->type) {
            $format = config('formforge.date_format');
        } elseif ('time' === $this->type) {
            $format = 'H:i:s';
        }

        return $format;
    }
}
