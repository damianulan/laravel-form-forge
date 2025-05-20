# Laravel FormForge

### Description

Form forge is a form builder package for Laravel. It allows you to create forms with a simple and intuitive interface. FormForge provides Model autofill and laravel validation support.

### Usage & Examples

Create a class with your form definition. You need only one definition for both creating and editing operations.
In order to create a form use following artisan command:

```
php artisan make:form ExemplaryForm
```

Then modify your form by adding components you need.
... finally it should look like this:

```php
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
        ->add(FormComponent::trix('description', $model))
        ->add(FormComponent::datetime('deadline', $model)->info())
        ->add(FormComponent::decimal('expected', $model)->info('Here give explanation under questionmark icon'))
        ->add(FormComponent::switch('draft', $model)->default(false))
        ->addTitle($title) // optional
        ->addSubmit(); // completely optional - when using ajax you'd want to
}
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

See [EXAMPLES](docs/EXAMPLES.md) documentation for more examples containing full process of form creation.

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

### Resources

After publishing vendor assets, resource files will be available in `resources/vendor/formforge` directory. In order for package to work properly, please include `@import` base style file `_formforge.scss` in your projects main scss file and then rerun your npm build process.
Check out `_variables.scss` file to see what variables are available for customization.

### Upgrading

When upgrading to new version, remember to manually update package resources. Please run after `composer update` command, when upgrading this package, in order to overwrite package resources:

```
php artisan vendor:publish --tag=formforge-resources --force
```

### Testing

Coming soon.

### Localization

Currently package supports following languages:

- English (en)
- Polish (pl)

### What's coming next?

- JS package form support
- automatic testing

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
