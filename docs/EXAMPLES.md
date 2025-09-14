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
    public static function definition(Request $request, $model = null): FormBuilder
    {
        $route = null;
        $method = 'POST';
        $title = 'Form title when creating';
        if (!is_null($model)) {
            $method = 'PUT';
            $title = 'Form title when editing';
        }

        return FormBuilder::boot($request, $method, $route, 'form_html_id')
            ->template('horizontal') // modify form layout template -- it is 'horizontal' by default
            ->class('custom-form-classes')
            ->add(FormComponent::hidden('id', $model))
            ->add(FormComponent::select('template_id', $model, Dictionary::fromModel(Model::class, 'attribute'))->required()) // form element branded as required
            ->add(FormComponent::text('name', $model)->label('Name field label')->required())
            ->add(FormComponent::textarea('description', $model))
            ->add(FormComponent::datetime('deadline', $model)->info())
            ->add(FormComponent::decimal('expected', $model)->info('Here give explanation under questionmark icon'))
            ->add(FormComponent::switch('draft', $model)->default(false))
            ->addTitle($title) // optional
            ->addSubmit(); // completely optional - when using ajax you'd want to
    }

    // add validation rules
    public static function validation(Request $request, $model_id = null): array
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
// additional authorization check
public static function authorize(Request $request): bool
{
    return true;
}

// customize validation messages -- see laravel docs
protected static function messages(): array
{
    return [];
}

// customize validation attributes if needed -- see laravel docs
protected static function attributes(): array
{
    $attributes = [];

    $builder = static::definition(request());
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
        'form' => ExemplaryForm::definition($request),
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
public function update(Request $request, $id, CampaignEditForm $form)
{
    // fix html5 niuances in request
    $request = $form::reformatRequest($request);

    // validates request with rules declared in form class
    // if you dont want it to automatically redirect, use ::validateJson method instead
    $form::validate($request, $id);

    // automatically fills model from request
    // assign RequestForms trait to your model
    $model = Model::fillFromRequest($request, $id);

    if ($model && $model->update()) {
        return redirect()->route('pages.forms.show', $id)->with('success', 'success message');
    }
    return redirect()->back()->with('error', 'error message');
}
```
