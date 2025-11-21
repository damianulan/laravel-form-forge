<?php

namespace FormForge\Support;

use FormForge\Components\ForgeComponent;
use FormForge\Components\ForgeSection;
use FormForge\Exceptions\ForgeCollectionIllegalInput;
use Illuminate\Support\Collection;
use IteratorAggregate;

/**
 * Represents a collection of components.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025
 * @license MIT
 */
class ComponentCollection extends Collection
{
    /**
     * Push one or more items onto the end of the collection.
     *
     * @param  TValue  ...$values
     * @return $this
     */
    public function push(...$values)
    {
        $this->validateInput($values);
        parent::push(...$values);
    }

    /**
     * Add an item to the collection.
     *
     * @param  TValue  $item
     * @return $this
     */
    public function add($item)
    {
        $this->validateInput($item);
        parent::add($item);
    }

    /**
     * Set the item at a given offset.
     *
     * @param  TKey|null  $key
     * @param  TValue  $value
     */
    public function offsetSet($key, $value): void
    {
        $this->validateInput($value);
        parent::offsetSet($key, $value);
    }

    /**
     * Get only instances of ForgeComponent
     */
    public function getComponents(): self
    {
        return $this->filter(fn($component) => $component instanceof ForgeComponent);
    }

    /**
     * Validate if Forge Component
     *
     * @param  mixed  $input
     */
    private function validateInput($input): void
    {
        if (is_array($input) || $input instanceof IteratorAggregate) {
            foreach ($input as $item) {
                $this->checkInputType($item);
            }
        } else {
            $this->checkInputType($input);
        }
    }

    private function checkInputType($input): void
    {
        if (! ($input instanceof ForgeComponent || $input instanceof ForgeSection)) {
            throw new ForgeCollectionIllegalInput();
        }
    }
}
