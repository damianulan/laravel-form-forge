# Laravel FormForge

### Description

Form forge is a form builder package for Laravel. It allows you to create forms with a simple and intuitive interface. FormForge provides support for Model autofill and laravel validation support.

### Form definition

```php
use FormForge\Base\Form;
use FormForge\FormBuilder;
use FormForge\Base\FormComponent;
use FormForge\Components\Dictionary;
use Illuminate\Http\Request;

class ExemplaryForm extends Form
{

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
            ->add(FormComponent::decimal('weight', $model)->required())
            ->add(FormComponent::decimal('expected', $model)->info('Here give explanation under questionmark icon'))
            ->add(FormComponent::switch('draft', $model)->label(__('forms.mbo.objectives.draft'))->info(__('forms.mbo.objectives.info.draft'))->default(false))
            ->addTitle($title)
            ->addSubmit();
    }

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

    // customize validation attributes -- see laravel docs
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

    // add validation rules
    public static function validation(Request $request, $model_id = null): array
    {
        return [
            'template_id' => 'required',
            'name' => 'max:120|required',
            'deadline' => 'nullable',
            'description' => 'max:512|nullable',
            'weight' => 'decimal:2|required',
            'expected' => 'decimal:2|nullable',
            'award' => 'decimal:2|nullable',
            'draft' => 'boolean',
        ];
    }
}
```

## Getting Started

### Installation

### Dependencies

- Laravel ^11.0
- PHP ^8.3
- Bootstrap ^5.3
- Bootstrap Icons ^1.10 - icons' support
- flatpickr ^4.6 - datepicker inputs
- chosen.js ^1.8 - select inputs
- tippy.js ^6.3 - tooltips
- trix ^2.0 - rich text editors
- jQuery
