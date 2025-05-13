# Laravel FormForge

### Description

Form forge is a form builder package for Laravel. It allows you to create forms with a simple and intuitive interface. FormForge provides Model autofill and laravel validation support.

### Usage & Examples

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
            ->class('custom-form-classes')
            ->add(FormComponent::hidden('id', $model))
            ->add(FormComponent::select('template_id', $model, Dictionary::fromModel(Model::class, 'attribute'))->required()) // form element branded as required
            ->add(FormComponent::text('name', $model)->label('Name field label')->required())
            ->add(FormComponent::trix('description', $model))
            ->add(FormComponent::datetime('deadline', $model)->info())
            ->add(FormComponent::decimal('expected', $model)->info('Here give explanation under questionmark icon'))
            ->add(FormComponent::switch('draft', $model)->default(false))
            ->addTitle($title)
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

Then in your controller try generate new form builder instance into your view:

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

## Getting Started

### Installation

You can install the package via composer in your laravel project:

```
composer require damianulan/laravel-form-forge
```

The package will automatically register itself.

Next step is to publish necessary vendor assets.

```
php artisan vendor:publish --tag=formforge
```

Optionally you can publish all other assets (for modification purposes).

```
php artisan vendor:publish --tag=formforge-langs
php artisan vendor:publish --tag=formforge-views
```

### Testing

Coming soon.

### What's coming next?

- JS package support
- dedicated S

### Dependencies

- Laravel ^11.0
- PHP ^8.3
- Bootstrap ^5.3
- Bootstrap Icons ^1.10 - icons' support
- flatpickr ^4.6 - datepicker inputs
- chosen.js ^1.8 - select inputs
- tippy.js ^6.3 - tooltips
- trix ^2.0 - rich text editors
- jQuery ^3.6

### Contact & Contributing

Any question You can submit to **damian.ulan@protonmail.com**.
