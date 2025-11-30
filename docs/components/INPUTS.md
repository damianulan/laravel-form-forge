# FormForge Inputs

## Usage
Simple text input with placeholder and label.
```php
FormBuilder::boot($request, $method, $route, 'edit_form')
    ->class('campaign-create-form')
    ->add(FormComponent::text('name', $model)->label('Label for text input')->placeholder('Enter a name...')->required());
```

More textual inputs:
- numeric - integer input of type numeric
- decimal - custom float input with proprietary walidation
- password - with hidden content
- hidden - invisible content
