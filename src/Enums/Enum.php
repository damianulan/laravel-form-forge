<?php

namespace FormForge\Enums;

/**
 * This is custom 
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 * @package FormForge
 */
abstract class Enum implements \BackedEnum
{
    /**
     * Cache of constants for each enum class.
     *
     * @var array<class-string, array<string, string|int>>
     */
    protected static array $cache = [];

    /**
     * The actual value of the enum instance.
     *
     * @var string|int
     */
    private string|int $value;

    /**
     * Enum constructor. Validates that the value exists in the enum.
     *
     * @param string|int $value
     * @throws InvalidArgumentException if the value is not valid for the enum.
     */
    public function __construct(string|int $value)
    {
        if (!in_array($value, static::values(), true)) {
            throw new InvalidArgumentException("Invalid enum value: " . $value);
        }
        $this->value = $value;
    }

    /**
     * Returns the raw enum value.
     *
     * @return string|int
     */
    public function value(): string|int
    {
        return $this->value;
    }

    /**
     * Returns the human-readable label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return static::labels()[$this->value] ?? (string) $this->value;
    }

    /**
     * Returns a list of all enum values.
     *
     * @return array<int, string|int>
     */
    public static function values(): array
    {
        return array_values(static::cases());
    }

    /**
     * Returns a map of enum values to human-readable labels.
     * Should be overridden by child classes.
     *
     * @return array<string|int, string>
     */
    public static function labels(): array
    {
        return [];
    }

    /**
     * Returns an associative array of constant names to values.
     * Uses reflection and caches the result.
     *
     * @return array<string, string|int>
     */
    public static function cases(): array
    {
        $class = static::class;
        if (!isset(self::$cache[$class])) {
            $reflection = new ReflectionClass($class);
            self::$cache[$class] = $reflection->getConstants();
        }

        return self::$cache[$class];
    }

    /**
     * Creates a new enum instance from a given value.
     *
     * @param string|int $value
     * @return static
     */
    public static function fromValue(string|int $value): static
    {
        return new static($value);
    }

    /**
     * Compares this enum with another for equality.
     *
     * @param Enum $enum
     * @return bool
     */
    public function equals(Enum $enum): bool
    {
        return static::class === get_class($enum) && $this->value === $enum->value();
    }

    /**
     * Returns the string representation of the enum value.
     *
     * @return string
     */
    public function __toString(): string
    {
        return (string) $this->value;
    }
}
