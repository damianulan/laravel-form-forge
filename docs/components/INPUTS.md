# FormForge Inputs

## Text Input

```php
FormBuilder::boot($request, $method, $route, 'campaign_edit')
    ->class('campaign-create-form')
    ->add(FormComponent::text('name', $model)->label('Label for text input')->placeholder('Enter a name...')->required());
```

## Numeric Input

## Hidden Input

## Password Input
