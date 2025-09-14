<div class="w-100">
    <div class="{{ $classes ? $classes:'' }}@error($component->name) is-invalid @enderror"
    id="id_{{ $component->name }}"
    {{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}
    >{!! $component->value ?? '' !!}</div>

    <input type="hidden" name="{{ $component->name }}" class="formforge-container__input" value="{!! $component->value ?? '' !!}" />
    @error($component->name)
    <div class="invalid-feedback">
        {{ $message }}
    </div>
    @enderror
</div>
