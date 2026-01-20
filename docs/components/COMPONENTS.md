# FormForge Components Common Methods and Tools

## Macros
You are able to add your own components to the form, by creating macros to FormBuilder class.
It should return instance of ForgeComponent instance.
```php
FormComponent::macro('myComponent', static function (string $name, Model $model = null): ForgeComponent {
    $value = $model->{$name} ?? null;
    return new YourComponent($name, 'text', $value);
});
```
```php
class YourComponent extends ForgeComponent
{
    public string $name;

    public string $type;

    public ?string $value = null;

    public function __construct(string $name, string $type = 'text', ?string $value)
    {
        $this->name = empty($name) ? null : $name;
        $this->value = request()->old($name) ?? $value;
        $this->classes = [
            'form-control',
            'formforge-control',
        ];
    }

    /**
     * Renders the html representation of the Component.
     */
    public function render(): View
    {
        return view('components.yourcomponent',
                $this->getViewData()
            );
    }
}
```
In your component, override as many methods and properties as you need.

At last, add your component to the form builder instance:
```php
$method = 'POST';
$route = route('/');
return $builder->setId(is_null($this->model) ? 'form_create' : 'form_edit')
        ->setMethod($method)
        ->setAction($route)
        ->add(FormComponent::myComponent('name', $model)->label('Label for text input')->placeholder('Enter a name...')->required());
```
