# Laravel FormForge Examples

### Base form generation process

Create a class with your form definition. You need only one definition for both creating and editing operations.

```php
use FormForge\Base\Form;
use FormForge\FormBuilder;
use FormForge\Base\FormComponent;
use FormForge\Components\Dictionary;
use Illuminate\Http\Request;

class ExemplaryForm extends Form
{

    // Form definition - $model should be an Eloquent model instance
    public function definition(FormBuilder $builder): FormBuilder
    {
        $route = null;
        $method = 'POST';
        $title = 'Form title when creating';
        if (!is_null($model)) {
            $method = 'PUT';
            $title = 'Form title when editing';
        }

        return $builder->setId(is_null($this->model) ? 'form_create' : 'form_edit')
            ->setMethod($method)
            ->setAction($route)
            ->template('horizontal') // modify form layout template -- it is 'horizontal' by default
            ->class('custom-form-classes')
            ->add(FormComponent::hidden('id', $this->model)) // use this model if you filled a form with model instance or $this->$field_name which will be automatically filled with request
            ->add(FormComponent::select('template_id', $this->model, Dictionary::fromModel(Model::class, 'attribute'))->required()) // form element branded as required
            ->add(FormComponent::text('name', $this->model)->label('Name field label')->required())
            ->add(FormComponent::textarea('description', $this->model))
            ->add(FormComponent::datetime('deadline', $this->model)->info())
            ->add(FormComponent::decimal('expected', $this->model)->info('Here give explanation under questionmark icon'))
            ->add(FormComponent::switch('draft', $this->model)->default(false))
            ->addTitle($title) // optional form header
            ->addSubmit(); // completely optional - when using ajax you'd want to
    }

    // add validation rules
    public function validation(): array
    {
        return [
            'template_id' => 'required',
            'name' => 'max:120|required',
            'deadline' => 'nullable',
            'description' => 'max:512|nullable',
            'draft' => 'boolean',
        ];
    }
}
```

Optionally you can override default validation process methods:

```php
// customize validation messages -- see laravel docs
protected function messages(): array
{
    return [];
}

// customize validation attributes if needed -- see laravel docs
protected function attributes(): array
{
    $attributes = [];

    $builder = $this->getDefinition();
    if ($builder) {
        foreach ($builder->getComponents() as $component) {
            $attributes[$component->name] = $component->label;
        }
    }

    return $attributes;
}
```

Then in your controller, generate new form builder instance into your view:

```php
public function create(Request $request)
{
    return view('pages.forms.edit', [
        'form' => ExemplaryForm::bootWithRequest($request)->getDefinition(),
    ]);
}

public function edit(Request $request, Model $model)
{
    return view('pages.forms.edit', [
        'form' => ExemplaryForm::bootWithModel($model)->getDefinition(),
    ]);
}

// alternatively
public function edit(Request $request, Model $model, ExemplaryForm $form)
{
    return view('pages.forms.edit', [
        // using setModel allows you to access $this->model in your form definition
        'form' => $form->setModel($model)->getDefinition(),
    ]);
}
```

Then, in your blade template you can simply render the form:

```php
{{ $form->title() }} // optional
{{ $form->render() }}
```

Storing example:

```php
// form instance declared as parameter is automatically filled with props from request's inputs
public function update(Request $request, $id, CampaignEditForm $form)
{

    // validates request with rules declared in form class
    $form->validate();

    // automatically fills model from request
    // assign RequestForms trait to your model
    $model = Model::fillFromRequest($request, $id);

    if ($model && $model->update()) {
        return redirect()->route('pages.forms.show', $id)->with('success', 'success message');
    }
    return redirect()->back()->with('error', 'error message');
}
```

More Validation examples:
```php
// it automatically redirects back with errors, when failed
$form->validate();

// it returns a Laravel Validator instance
$form->validator();

// checks if validation failed / passed
$form->fails();
$form->passes();
```
