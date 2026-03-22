# FormForge Examples

This guide shows the usual package workflow from form definition to rendering and saving.

## Example Form Class

Create one form class and reuse it for both create and edit operations.

```php
<?php

namespace App\Forms;

use App\Models\Project;
use App\Models\User;
use FormForge\Base\Form;
use FormForge\Base\FormComponent;
use FormForge\Components\Button;
use FormForge\Components\Dictionary;
use FormForge\FormBuilder;

class ProjectForm extends Form
{
    public function definition(FormBuilder $builder): FormBuilder
    {
        $isEdit = $this->model instanceof Project;

        return $builder
            ->setId($isEdit ? 'project_edit_form' : 'project_create_form')
            ->setMethod($isEdit ? 'PUT' : 'POST')
            ->setAction($isEdit
                ? route('projects.update', $this->model)
                : route('projects.store'))
            ->setTemplate('horizontal')
            ->setTitle($isEdit ? 'Edit project' : 'Create project')
            ->class('project-form')
            ->add(FormComponent::hiddenId(default: $this->model))
            ->add(
                FormComponent::text('name', $this->model)
                    ->label('Project name')
                    ->placeholder('Enter project name')
                    ->required()
                    ->maxlength(120)
            )
            ->add(
                FormComponent::textarea('description', $this->model)
                    ->label('Description')
                    ->col(12)
            )
            ->add(
                FormComponent::select(
                    'owner_id',
                    $this->owner_id,
                    Dictionary::fromModel(User::class, 'name')
                )
                    ->label('Owner')
                    ->required()
                    ->noEmpty()
            )
            ->add(
                FormComponent::date('starts_at', $this->model)
                    ->label('Start date')
            )
            ->add(
                FormComponent::datetime('deadline', $this->model)
                    ->label('Deadline')
                    ->info('Optional final cutoff date and time')
            )
            ->add(
                FormComponent::switch('active', $this->model)
                    ->label('Active')
                    ->default(true)
            )
            ->addButton(Button::back())
            ->addSubmit();
    }

    public function validation(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'owner_id' => ['required', 'integer', 'exists:users,id'],
            'starts_at' => ['nullable', 'date'],
            'deadline' => ['nullable', 'date'],
            'active' => ['boolean'],
        ];
    }

    protected function messages(): array
    {
        return [
            'owner_id.required' => 'Please choose a project owner.',
        ];
    }
}
```

## Rendering a Create Form

```php
public function create()
{
    return view('projects.form', [
        'form' => ProjectForm::bootWithRequest()->getDefinition(),
    ]);
}
```

## Rendering an Edit Form

```php
public function edit(Project $project)
{
    return view('projects.form', [
        'form' => ProjectForm::bootWithModel($project)->getDefinition(),
    ]);
}
```

## Blade Template

```blade
{{ $form->title() }}

<div class="container-fluid">
    {{ $form->render() }}
</div>

@push('scripts')
    {{ $form->scripts() }}
@endpush
```

## Store Action

```php
public function store(ProjectForm $form)
{
    $form->validate();

    $project = Project::fillFromRequest();
    $project->save();

    return redirect()->route('projects.index')
        ->with('success', 'Project created.');
}
```

## Update Action

```php
public function update(Project $project, ProjectForm $form)
{
    $form->validate();

    $project = Project::fillFromRequest($project->getKey());
    $project->save();

    return redirect()->route('projects.show', $project)
        ->with('success', 'Project updated.');
}
```

## Booting Variants

### Boot from current request

```php
$form = ProjectForm::bootWithRequest();
```

### Boot from explicit attributes

```php
$form = ProjectForm::bootWithAttributes([
    'active' => true,
    'owner_id' => auth()->id(),
]);
```

### Boot from model without merging current request input

```php
$form = ProjectForm::bootWithModel($project, withRequest: false);
```

## Conditional Fields

You can add fields only when a condition matches:

```php
return $builder
    ->add(
        FormComponent::text('external_reference')
            ->label('External reference'),
        fn () => auth()->user()?->isAdmin() ?? false
    );
```

Or use `when()` on the builder:

```php
return $builder
    ->when($this->active === false, function (FormBuilder $builder): void {
        $builder->add(
            FormComponent::textarea('inactive_reason')
                ->label('Reason for deactivation')
        );
    });
```

## Protected Forms

If the entire form should be blocked for unauthorized users:

```php
return $builder
    ->authorize(fn () => auth()->user()?->can('projects.manage') ?? false)
    ->addSubmit();
```

This throws `FormForge\Exceptions\FormUnauthorized` when the callback returns `false`.

## Notes

- Use one form class per domain form, not one per route.
- Prefer model-based booting for edit screens.
- Keep validation rules inside the form class so definition and validation stay together.
- Use `RequestForms` on models only when request-driven hydration matches your application rules.
