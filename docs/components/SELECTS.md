# FormForge Selects

## Usage
```php
return FormBuilder::boot($request, 'post', route('store'), 'example')
    ->class('example-form')
    // select with model instances. uses 'name' as display value
    ->add(FormComponent::select('model_select', $this->model_select, Dictionary::fromModel(ObjectiveTemplate::class, 'name'))->required()->label(__('forms.label')))
    
    // select built with array values - provide lang component to match with given values
    ->add(FormComponent::select('array_select', $this->array_select, Dictionary::fromUnassocArray(['option_1', 'option_2'], 'lang_component.tomatch.given.options'), 'default_select'))

    // select with values as keys and values as display values
    ->add(FormComponent::select('array_select', $this->model_array_selectselect, Dictionary::fromAssocArray(['option_1' => 'Output 1']), 'default_select'))

    // select with yes / no values
    ->add(FormComponent::select('boolean_select', $this->boolean_select, Dictionary::yesNo(), 'default_select'))

    // from enum class
    ->add(FormComponent::select('boolean_select', $this->boolean_select, Dictionary::fromEnum(Enum::class), 'default_select'))

```
If you need to have multiple options selectable, use `::multiselect()` method instead.
