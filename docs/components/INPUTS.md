# Text and Numeric Inputs

Use `Input`-based components for text-like fields, numeric-like values, passwords, and hidden values.

## Available Factories

- `FormComponent::text()`
- `FormComponent::numeric()`
- `FormComponent::decimal()`
- `FormComponent::password()`
- `FormComponent::hidden()`
- `FormComponent::hiddenId()`

## Text Input

```php
$builder->add(
    FormComponent::text('name', $this->model)
        ->label('Project name')
        ->placeholder('Enter project name')
        ->required()
        ->maxlength(120)
);
```

## Numeric Input

`numeric()` creates a text-based input configured for integer-style numeric entry.

```php
$builder->add(
    FormComponent::numeric('priority', $this->priority)
        ->label('Priority')
        ->required()
);
```

## Decimal Input

`decimal()` creates a text-based input configured for decimal values.

```php
$builder->add(
    FormComponent::decimal('budget', $this->budget)
        ->label('Budget')
        ->info('Example: 1000.50')
);
```

The package request mutator also attempts to normalize EU-style decimal strings such as `10,50`.

## Password Input

```php
$builder->add(
    FormComponent::password('password')
        ->label('Password')
        ->required()
        ->minlength(8)
);
```

Typical validation:

```php
'password' => ['required', 'string', 'min:8'],
```

## Hidden Inputs

Use `hidden()` for any hidden field:

```php
$builder->add(FormComponent::hidden('module', 'projects'));
```

Use `hiddenId()` when editing an existing model and you only want the field rendered when a value exists:

```php
$builder->add(FormComponent::hiddenId(default: $this->model));
```

## Common Input Methods

Input components support the shared component methods plus:

- `maxlength(int $value)`
- `minlength(int $value)`
- `numeric()`
- `decimal()`

Example:

```php
FormComponent::text('code')
    ->label('Project code')
    ->maxlength(20)
    ->class('text-uppercase');
```

## Value Resolution

Input values are typically resolved in this order:

1. old input from the current request, if present,
2. the provided default value,
3. a value extracted from the provided model.

That makes the same field work cleanly across:

- initial create screens,
- edit screens,
- validation-failed redirects.
