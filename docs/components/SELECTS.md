# Selects and Option Dictionaries

FormForge provides single-select and multi-select fields backed by option collections.

## Available Factories

- `FormComponent::select()`
- `FormComponent::multiselect()`

Under the hood, options are usually built with `FormForge\Components\Dictionary`.

## Single Select

```php
use App\Models\User;
use FormForge\Base\FormComponent;
use FormForge\Components\Dictionary;

$builder->add(
    FormComponent::select(
        'owner_id',
        $this->owner_id,
        Dictionary::fromModel(User::class, 'name')
    )
        ->label('Owner')
        ->required()
        ->noEmpty()
);
```

## Multi Select

```php
$builder->add(
    FormComponent::multiselect(
        'user_ids',
        $this->user_ids ?? [],
        Dictionary::fromModel(User::class, 'name')
    )->label('Users')
);
```

`multiselect()` also accepts a `Collection` or model-derived relationship values.

## Dictionary Helpers

### `Dictionary::fromModel()`

Build options from model records.

```php
Dictionary::fromModel(User::class, 'name');
```

Signature:

```php
Dictionary::fromModel(
    string $model,
    string $attribute,
    string $method = 'all',
    array $exclude = []
);
```

Example with a custom retrieval method:

```php
Dictionary::fromModel(User::class, 'name', 'active');
```

Example with exclusions:

```php
Dictionary::fromModel(User::class, 'name', 'all', [
    ['id' => 1],
]);
```

### `Dictionary::fromUnassocArray()`

Build options from a plain value list.

```php
Dictionary::fromUnassocArray(['draft', 'published', 'archived']);
```

With translated labels:

```php
Dictionary::fromUnassocArray(
    ['draft', 'published', 'archived'],
    'projects.statuses'
);
```

### `Dictionary::fromAssocArray()`

Build options from explicit key/value pairs.

```php
Dictionary::fromAssocArray([
    'draft' => 'Draft',
    'published' => 'Published',
]);
```

### `Dictionary::yesNo()`

Build a simple yes/no option list.

```php
Dictionary::yesNo();
```

### `Dictionary::fromEnum()`

Build options from a PHP enum-like class.

```php
Dictionary::fromEnum(App\Enums\Status::class);
```

With explicit readable labels:

```php
Dictionary::fromEnum(App\Enums\Status::class, [
    'draft' => 'Draft',
    'published' => 'Published',
]);
```

## Select Methods

Select components support shared component methods plus:

- `multiple()`
- `noEmpty()`

### `multiple()`

Marks the select as a multi-select. This is already applied by `FormComponent::multiselect()`.

### `noEmpty()`

Removes the empty placeholder option from the select.

## Notes

- Select front-end enhancement depends on the published package JavaScript and `chosen-js`.
- Use `noEmpty()` for required selects where an empty first option would be misleading.
- Prefer `Dictionary::fromAssocArray()` when database values and visible labels should differ.
