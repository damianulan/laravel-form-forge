<?php

namespace FormForge\Traits;

trait HasAttributes
{

    /**
     * Request datas
     *
     * @var array
     */
    protected $attributes = [];

    public function __set(string $property, $value)
    {
        $this->setAttribute($property, $value);
    }

    public function __get(string $property)
    {
        return $this->getAttribute($property);
    }

    public function __isset(string $property)
    {
        return $this->hasAttribute($property);
    }

    public function __unset(string $property): void
    {
        if ($this->hasAttribute($property)) {
            unset($this->attributes[$property]);
        }
    }

    public function setAttribute(string $property, $value)
    {
        if(empty($this->fillable) || in_array($property, $this->fillable)) {
            $this->attributes[$property] = $value;
        }
    }

    public function getAttribute(string $property)
    {
        return $this->attributes[$property] ?? null;
    }

    public function hasAttribute(string $property): bool
    {
        return isset($this->attributes[$property]);
    }

}
