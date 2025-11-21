<select id="id_{{ $component->name }}" class="{{ $classes ? $classes:'' }} @error($component->name) is-invalid @enderror"
name="{{ $component->name }}{{ $component->multiple ? '[]':'' }}"{{ $component->placeholder ? ' data-placeholder="'.$component->placeholder.'"':'' }}
{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}{{ $component->multiple ? ' multiple':'' }}>
@if($component->multiple === false && $component->empty_field)
<option></option>
@endif
@if (!empty($component->options))
    @foreach ($component->options as $option)
        <option value="{{ $option->value }}"
            @if(request()->old($component->name) && ( $option->value == request()->old($component->name) || (is_array(request()->old($component->name)) && in_array($option->value, request()->old($component->name))) ))
                selected
            @elseif(in_array($option->value,$component->values))
                selected
            @endif
            >{{ $option->content }}</option>
    @endforeach
@endif
</select>
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
