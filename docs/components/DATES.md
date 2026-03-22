# Dates and Time Inputs

FormForge ships with date-aware components integrated with `flatpickr`.

## Available Factories

- `FormComponent::date()`
- `FormComponent::time()`
- `FormComponent::datetime()`
- `FormComponent::birthdate()`
- `FormComponent::daterange()`

## Date

```php
$builder->add(
    FormComponent::date('starts_at', $this->model)
        ->label('Start date')
);
```

The displayed value uses `config('formforge.date_format')`.

## Time

```php
$builder->add(
    FormComponent::time('start_time', $this->start_time)
        ->label('Start time')
);
```

## Datetime

```php
$builder->add(
    FormComponent::datetime('deadline', $this->model)
        ->label('Deadline')
        ->info('Final due date and time')
);
```

## Birthdate

```php
$builder->add(
    FormComponent::birthdate('birthday', $this->model)
        ->label('Birthdate')
);
```

This behaves like a date field, but gives you a more explicit semantic choice in the form definition.

## Date Range

`daterange()` creates a pair of fields based on one logical name.

```php
$builder->add(
    FormComponent::daterange('period', [
        'from' => '2026-01-01',
        'to' => '2026-01-31',
    ])->label('Period')
);
```

The submitted field names become:

- `period_from`
- `period_to`

You can also pass a model when those two attributes exist on the model:

```php
FormComponent::daterange('period', $this->model);
```

## Date Limits

Date-like components support:

- `minDate(string $date)`
- `maxDate(string $date)`

Example:

```php
FormComponent::date('starts_at')
    ->label('Start date')
    ->minDate(now()->format('Y-m-d'))
    ->maxDate(now()->addYear()->format('Y-m-d'));
```

## Configuration

Formatting comes from `config/formforge.php`:

```php
'date_format' => 'Y-m-d',
'time_format' => 'H:i',
'datetime_format' => 'Y-m-d H:i',
```

## Notes

- These components expect the package JavaScript plus `flatpickr` to be available.
- Date and time values are formatted for display when building the component.
- Date-range helper fields use `_from` and `_to` suffixes automatically.
