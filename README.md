# Laravel FormForge

[![Static Badge](https://img.shields.io/badge/made_with-Laravel-red?style=for-the-badge)](https://laravel.com/docs/11.x/releases) &nbsp; [![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE) &nbsp; [![Static Badge](https://img.shields.io/badge/maintainer-damianulan-blue?style=for-the-badge)](https://damianulan.me)

### Description

Form forge is a form builder package for Laravel. It allows you to create forms with a simple and intuitive interface. FormForge provides Model autofill and laravel validation support.

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
```

### Resources

```
php artisan vendor:publish --tag=formforge-resources
```

After publishing vendor assets, resource files will be available in `resources/vendor/formforge` directory. In order for package to work properly, please include `@import` base style file `_formforge.scss` in your projects main scss file and then rerun your npm build process.
Check out `_variables.scss` file to see what variables are available for customization.

The same you should do for `form.js` file copied from `resources/vendor/formforge/js` directory.

To properly include package scripts, just add `@formForgeScripts` to your footer before main js bundle file.

```html
@formForgeScripts
<script src="{{ asset('themes/js/app.js') }}"></script>
```
It includes declaring global variables.
```js
    const choose = '{{ __('Choose results') }}';
    const no_results = '{{ __('No results found') }}';

    const datetime_format = '{{ __('Y-m-d H:i:s') }}';
    const time_format = '{{ __('Y-m-d') }}';
    const date_format = '{{ __('H:i') }}';
```

### Upgrading to v2

Whenever upgrading to any new version, remember to manually update package resources. Please run after `composer update` command, when upgrading this package, in order to overwrite package resources:

```
php artisan vendor:publish --tag=formforge-resources --force
```

Upgrading to v2 will also require you to update your form definitions, according to the new syntax. Please check examples in [EXAMPLES](docs/EXAMPLES.md) this version of documentation.

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
        ->add(FormComponent::hidden('id', $this->id))
        ->add(FormComponent::select('template_id', $this->template_id, Dictionary::fromModel(Model::class, 'attribute'))->required()) // form element branded as required
        ->add(FormComponent::text('name', $this->name)->label('Name field label')->required())
        ->add(FormComponent::textarea('description', $this->description))
        ->add(FormComponent::datetime('deadline', $this->deadline)->info())
        ->add(FormComponent::decimal('expected', $this->expected)->info('Here give explanation under questionmark icon'))
        ->add(FormComponent::switch('draft', $this->draft)->default(false))
        ->addTitle($title) // optional
        ->addSubmit(); // completely optional - when using ajax you'd want to
}
```

Storing example:

```php
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

See [EXAMPLES](docs/EXAMPLES.md) documentation for more examples containing full process of form creation.

### Localization

Currently package supports following languages:

- English (en)
- Polish (pl)

### Components

- [Inputs](docs/components/INPUTS.md)
- [Selects](docs/components/SELECT.md)
- [Dates](docs/components/DATES.md)
- [Checkboxes & radios](docs/components/CHECKBOXES.md)
- [File](docs/components/FILE.md)
- Textarea - simple textarea with option to manipulate cols and size. Assign a rich text editor to it by class for example on your own.
- [Sections](docs/components/SECTIONS.md)

See more in [COMPONENTS](docs/components/COMPONENTS.md) documentation.

### Dependencies

- Laravel ^11.0
- PHP ^8.3
- Bootstrap ^5.3
- Bootstrap Icons ^1.10 - icons' support
- jQuery ^3.6

### Contact & Contributing

Any question You can submit to **damian.ulan@protonmail.com**.
