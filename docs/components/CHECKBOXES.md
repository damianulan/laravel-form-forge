# FormForge Checkboxes

## Usage
There are three component types for boolean inputs
- checkbox
- switch
- radio

Only difference is visual appearance.

Add them to your form builder instance like this:
```php
    ->add(FormComponent::switch('enabled', $model)->label(__('Your label'))->info(__('info popup explanation')))
    ->add(FormComponent::checkbox('active', $model)->label(__('Your label'))->info(__('info popup explanation')))
    ->add(FormComponent::checkbox('active', $model)->label(__('Your label'))->info(__('info popup explanation')))
```

Please note that values of these inputs are passed to the request as strings ['on', 'off'] and not booleans nor integers.
In your model you should use `boolean` cast for these fields, or cast with `FormForge\Casts\CheckboxCast` FormForge castable.

```php
class YourModel extends Model
{
    protected $casts = [
        'enabled' => CheckboxCast::class,
        'active' => 'boolean',
    ];
}
```
