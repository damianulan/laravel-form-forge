<?php

namespace FormForge\Support\Dtos;

abstract class Dto
{
    protected $attributes = [];

    protected $fillable = [];

    public function fill(array $attributes = [], $override = false): static
    {
        foreach ($attributes as $property => $value) {
            if ( ! $override || ! $this->hasAttribute($property)) {
                $this->setAttribute($property, $value);
            }
        }

        return $this;
    }

    public function __set(string $property, $value): void
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

    public function setAttribute(string $property, $value): void
    {
        if (empty($this->fillable) || in_array($property, $this->fillable)) {
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

    /**
     * Gets all attributes.
     *
     * @return array
     */
    public function all(): array
    {
        return $this->attributes;
    }
}
