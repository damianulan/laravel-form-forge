# FormForge Textarea

## Usage
Simple textarea input with placeholder and label.
```php
FormBuilder::boot($request, $method, $route, 'edit_form')
    ->class('create-form')
    ->add(FormComponent::textarea('name', $model)->label('Label for text input')->placeholder('Enter a name...')->required());
