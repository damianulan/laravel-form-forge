# FormForge Inputs

## Usage
Simple text input with placeholder and label.
```php
return $builder->setId(is_null($this->model) ? 'form_create' : 'form_edit')
    ->class('create-form')
    ->add(FormComponent::text('name', $this->name)->label('Label for text input')->placeholder('Enter a name...')->required());
```

More textual inputs:
- numeric - integer input of type numeric
- decimal - custom float input with proprietary walidation
- password - with hidden content
- hidden - invisible content
