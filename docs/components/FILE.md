# File Inputs

Use `FormComponent::file()` when a form should accept uploaded files.

## Basic Usage

```php
$builder->add(
    FormComponent::file('attachment')
        ->label('Attachment')
);
```

## Restrict Accepted File Types

You can pass accepted extensions or MIME-like patterns when creating the field:

```php
$builder->add(
    FormComponent::file('attachment', null, ['image/*', '.pdf'])
        ->label('Attachment')
);
```

Or append them later:

```php
FormComponent::file('attachment')
    ->label('Attachment')
    ->setExt(['image/*', '.pdf']);
```

## Multiple Files

```php
$builder->add(
    FormComponent::file('attachments')
        ->label('Attachments')
        ->multiple()
);
```

## Model Hydration

If your model uses `FormForge\Traits\RequestForms`, uploaded files can be stored automatically during `fillFromRequest()`.

Important points:

- only fillable attributes are assigned,
- files are stored only when FormForge file handling is enabled,
- the stored path is written back to the model attribute.

## Storage Configuration

Relevant config:

```php
'storage' => [
    'handling_files' => env('FORMFORGE_HANDLING_FILES', true),
    'path' => storage_path('app/public/uploads'),
],
```

Models using `RequestForms` can also define their own storage path:

```php
protected $storagePath = 'uploads';
```

## Validation

Typical validation rules:

```php
'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,png'],
'attachments' => ['nullable', 'array'],
```

If you accept multiple files, also validate each file entry according to your application rules.
