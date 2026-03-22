# Checkboxes, Switches, and Radios

FormForge provides three boolean-style components:

- `checkbox`
- `switch`
- `radio`

These components are primarily different in visual presentation.

## Usage

```php
$builder
    ->add(
        FormComponent::switch('enabled', $this->enabled)
            ->label('Enabled')
            ->info('Turn this on to activate the feature')
            ->default(true)
    )
    ->add(
        FormComponent::checkbox('visible', $this->visible)
            ->label('Visible to users')
    )
    ->add(
        FormComponent::radio('approved', $this->approved)
            ->label('Approved')
    );
```

## Default Values

Use `default()` when the field should have a fallback value only if it is not already filled by request data or a model.

```php
FormComponent::switch('active')
    ->label('Active')
    ->default(true);
```

## Request Values

Checkbox-like inputs are typically posted as `'on'` or `'off'` style values in the request lifecycle.

FormForge normalizes these values in its request mutators, and `RequestForms` also tries to respect boolean casts when hydrating a model.

## Model Casting

For Eloquent models, use a boolean cast or the package checkbox cast when appropriate.

```php
use FormForge\Casts\CheckboxCast;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $casts = [
        'enabled' => CheckboxCast::class,
        'visible' => 'boolean',
        'approved' => 'boolean',
    ];
}
```

## Validation

Typical validation rule:

```php
'enabled' => ['boolean'],
```

## Recommendation

Use:

- `switch()` when the UI should read like a toggle,
- `checkbox()` for standard checkbox semantics,
- `radio()` only when the single radio-style appearance is intentional in your UI.
