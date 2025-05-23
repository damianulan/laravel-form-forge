<input type="{{ $component->type }}" class="{{ $classes ? $classes:'' }} @error($component->name) is-invalid @enderror" data-min-date="{{ $component->minDate }}" data-max-date="{{ $component->maxDate }}"
id="id_{{ $component->name }}" name="{{ $component->name }}" autocomplete="off" value="{{ $component->value ?? '' }}" placeholder="{{ $component->placeholder ? $component->placeholder:'' }}"
{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}
>
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
