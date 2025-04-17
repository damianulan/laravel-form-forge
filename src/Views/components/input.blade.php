<input type="{{ $component->type }}" class="{{ $classes ? $classes:'' }}@error($component->name) is-invalid @enderror"
id="id_{{ $component->name }}" name="{{ $component->name }}" value="{{ $component->value ?? '' }}"  placeholder="{{ $component->placeholder ? $component->placeholder:'' }}"
{{ $component->maxlength ? ' maxlength="'.$component->maxlength.'"':'' }}{{ $component->minlength ? ' minlength="'.$component->minlength.'"':'' }}{{ !empty($component->autocomplete) ? ' autocomplete="'.$component->autocomplete."'":'' }}
{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}{{ $component->numeric ? ' data-validation=numeric':'' }}{{ $component->numeric&&$component->numeric_type ? ' data-numeric='.$component->numeric_type:'' }}
>
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
