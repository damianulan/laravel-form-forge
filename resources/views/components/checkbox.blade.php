<div class="form-check{{ $component->type === 'switch' ? ' form-switch':'' }}@error($component->name) is-invalid @enderror">
    <input type="hidden" name="{{ $component->name }}" value="off">
    <input class="form-check-input" type="{{ $component->type === 'radio' ? 'radio':'checkbox' }}" {{ $component->type === 'switch' ? 'role=switch':'' }}
    id="id_{{ $component->name }}" name="{{ $component->name }}"{{ $component->checked ? ' checked':'' }}{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}
    >
</div>
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
