# Common Component Methods

All built-in fields inherit from `FormForge\Components\ForgeComponent`, which gives them a shared fluent API for labels, hints, visibility, layout, and basic HTML behavior.

## Shared Methods

### `label(string|Closure $text)`

Sets the visible field label.

```php
FormComponent::text('name')->label('Project name');
```

### `key(string|Closure|null $key)`

Adds secondary muted text below the label. This is useful for short hints, internal field keys, or extra context.

```php
FormComponent::text('name')
    ->label('Project name')
    ->key('Visible to all project members');
```

### `required(?Closure $condition = null)`

Marks the component as required in the UI. This is visual only and does not replace Laravel validation rules.

```php
FormComponent::text('name')
    ->label('Project name')
    ->required();
```

Conditional variant:

```php
FormComponent::text('tax_id')
    ->label('Tax ID')
    ->required(fn () => $this->company_type === 'company');
```

### `disabled()`

Renders the field as disabled.

```php
FormComponent::text('slug')
    ->label('Slug')
    ->disabled();
```

### `readonly()`

Renders the field as read-only.

```php
FormComponent::text('email')
    ->label('Email')
    ->readonly();
```

### `placeholder(string $text)`

Sets the HTML placeholder.

```php
FormComponent::text('name')
    ->placeholder('Enter project name');
```

### `value(string $value)`

Overrides the default value.

```php
FormComponent::text('status')
    ->value('draft');
```

### `purifyValue()`

Sanitizes the current value using the package purifier configuration.

This is most useful for rich text or HTML-like input content.

```php
FormComponent::textarea('body')
    ->purifyValue();
```

### `class(string ...$classes)`

Adds custom CSS classes to the component wrapper/input markup.

```php
FormComponent::text('name')
    ->class('project-name-field', 'mb-4');
```

### `info(string $text)`

Adds a tooltip info icon. Multiple calls add multiple info entries.

```php
FormComponent::decimal('budget')
    ->label('Budget')
    ->info('Use a decimal number such as 1000.50');
```

### `autocomplete(string $type)`

Sets the HTML `autocomplete` attribute.

```php
FormComponent::text('email')
    ->autocomplete('email');
```

### `col(int $cols)`

Controls width in grid-oriented templates.

```php
FormComponent::text('city')
    ->col(4);
```

### `when(Closure $callback)`

Controls whether the component is shown.

```php
FormComponent::text('archived_reason')
    ->label('Archive reason')
    ->when(fn () => $this->archived === true);
```

## Component-Specific Methods

Some components add their own fluent methods on top of the shared API.

### Input

- `maxlength(int $value)`
- `minlength(int $value)`
- `numeric()`
- `decimal()`

### Select

- `multiple()`
- `noEmpty()`

### Datetime

- `minDate(string $date)`
- `maxDate(string $date)`

### Checkbox

- `default(bool $checked)`

### File

- `setExt(array $accepts)`
- `multiple()`

## Builder Macros

If you need a custom field type, you can register your own macro on `FormComponent`.

```php
use FormForge\Base\FormComponent;
use FormForge\Components\ForgeComponent;
use Illuminate\Database\Eloquent\Model;

FormComponent::macro('myComponent', function (string $name, ?Model $model = null): ForgeComponent {
    $value = $model?->{$name};

    return new YourComponent($name, 'text', $value);
});
```

Then use it like any built-in component:

```php
$builder->add(
    FormComponent::myComponent('custom_field')
        ->label('Custom field')
);
```

## Recommendation

Keep component customization fluent and local to the form definition. Reach for macros only when the same custom field pattern appears repeatedly across multiple forms.
