# Sections

Sections let you group related fields under a heading.

They are useful for:

- long forms,
- settings screens,
- visual separation between domains of data,
- create/edit screens that mix many unrelated field groups.

## Basic Usage

```php
use FormForge\Base\FormComponent;
use FormForge\FormBuilder;

return $builder
    ->setId('settings_form')
    ->setMethod('POST')
    ->setAction(route('settings.update'))
    ->class('settings-form')
    ->addSection('General settings', function (FormBuilder $builder): FormBuilder {
        return $builder
            ->add(
                FormComponent::switch('enabled', $this->enabled)
                    ->label('Enabled')
                    ->info('Turn this on to enable the module')
            )
            ->add(
                FormComponent::text('name', $this->name)
                    ->label('Name')
                    ->required()
            );
    });
```

## How It Works

`addSection()` accepts:

- a section title,
- a callback that receives a fresh `FormBuilder` instance for that section.

Inside the callback, return the section builder with the fields you want grouped together.

## Example With Multiple Sections

```php
return $builder
    ->addSection('General', function (FormBuilder $builder): FormBuilder {
        return $builder
            ->add(FormComponent::text('name')->label('Name'))
            ->add(FormComponent::textarea('description')->label('Description'));
    })
    ->addSection('Scheduling', function (FormBuilder $builder): FormBuilder {
        return $builder
            ->add(FormComponent::date('starts_at')->label('Start date'))
            ->add(FormComponent::datetime('deadline')->label('Deadline'));
    });
```

## Recommendation

Use sections when they improve scanability. For short forms, a flat form definition is usually simpler and easier to maintain.
