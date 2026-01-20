# FormForge Dates

Uses flatpickr.io library to generate datepickers.

## Usage
```php
// daterange generates two datepickers, and given name results with:
// $name . '_from' and $name . '_to'
->add(FormComponent::daterange($name, $this->model)->label($info))

// produces a single datepicker with given name in date format declared in config
->add(FormComponent::date($name, $this->model)->label($info))

// produces a single datepicker with given name in datetime format declared in config
->add(FormComponent::datetime($name, $this->model)->label($info))

// produces a single datepicker with given name in time format declared in config
->add(FormComponent::datetime($name, $this->model)->label($info))
```
