# Form Sections

## Usage

```php
return FormBuilder::boot($request, 'post', route('store'), 'settings')
        ->class('settings-form')
        ->add(FormComponent::hidden('module', 'mbo'))
        ->addSection(__('forms.settings.general.general'), fn (FormBuilder $builder) => $builder
            ->add(FormComponent::switch('enabled', $model)->label(__('forms.settings.enabled'))->info(__('forms.settings.info.enabled')))
        )
```
