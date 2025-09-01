<textarea class="{{ $classes ? $classes:'' }}@error($component->name) is-invalid @enderror" style="{{ !$component->resize ? 'resize:none;':'' }}"
id="id_{{ $component->name }}" name="{{ $component->name }}" placeholder="{{ $component->placeholder ? $component->placeholder:'' }}"
{{ !empty($component->cols) ? ' cols="'.$component->cols."'":'' }} {{ !empty($component->rows) ? ' rows="'.$component->rows."'":'' }} {{ !empty($component->autocomplete) ? ' autocomplete="'.$component->autocomplete."'":'' }}
{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}
>{!! $component->value ?? '' !!}</textarea>
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
