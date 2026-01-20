# Form Sections

Helps to divide different category of inputs. Treat it as input groups.

## Usage

```php
return $builder->setId(is_null($this->model) ? 'form_create' : 'form_edit')
        ->setMethod($method)
        ->setAction($route)
        ->class('settings-form')
        ->add(FormComponent::hiddenId('id', $this->model))
        ->add(FormComponent::hidden('module'))
        ->addSection(__('forms.settings.general.general'), fn (FormBuilder $builder) => $builder
            ->add(FormComponent::switch('enabled', $this->enabled)->label(__('forms.settings.enabled'))->info(__('forms.settings.info.enabled')))
        )
```
