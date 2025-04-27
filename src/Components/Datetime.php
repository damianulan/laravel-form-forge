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

    public function minDate(string $date): self
    {
        $this->minDate = $date;
        return $this;
    }

    public function maxDate(string $date): self
    {
        $this->maxDate = $date;
        return $this;
    }

    public function getFormat(): string
    {
        $format = 'Y-m-d H:i:s';
        if ($this->type === 'date' || $this->type === 'birthdate') {
            $format = 'Y-m-d';
        } elseif ($this->type === 'time') {
            $format = 'H:i:s';
        }
        return $format;
    }
}
