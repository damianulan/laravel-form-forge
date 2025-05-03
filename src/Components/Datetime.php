<?php

namespace FormForge\Components;

use Illuminate\Http\Request;
use FormForge\Components\ForgeComponent;

class Datetime extends ForgeComponent
{

    public string $name;
    public string $type;
    public ?string $value = null;
    public ?string $minDate = null;
    public ?string $maxDate = null;

    /**
     * Create a date/time/datetime input.
     *
     * @param string      $name
     * @param string      $type
     * @param string|null $value
     * @param string|null $minDate
     * @param string|null $maxDate
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
        if (!$this->value) {
            $this->value = empty($value) ? null : date($this->getFormat(), strtotime($value));
        }

        $this->classes[] = 'form-control';

        if ($this->type) {
            $this->classes[] = $this->type . 'picker';
        }
        $this->placeholder(__('formforge::forms.placeholders.choose_' . $this->type));
    }

    /**
     * Set minimum accessible date for the input.
     *
     * @param string $date
     * @return self
     */
    public function minDate(string $date): self
    {
        $this->minDate = $date;
        return $this;
    }

    /**
     * Set maximum accessible date for the input.
     *
     * @param string $date
     * @return self
     */
    public function maxDate(string $date): self
    {
        $this->maxDate = $date;
        return $this;
    }

    public function getFormat(): string
    {
        $format = config('formforge.date_format') . ' H:i:s';
        if ($this->type === 'date' || $this->type === 'birthdate') {
            $format = config('formforge.date_format');
        } elseif ($this->type === 'time') {
            $format = 'H:i:s';
        }
        return $format;
    }
}
