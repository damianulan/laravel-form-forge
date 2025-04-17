<x-components.trix-field id="id_{{ $component->name }}" name="{{ $component->name }}" toolbar="{{ $component->toolbar }}" value="{{ request()->old($component->name) ?? $component->value }}" />
@error($component->name)
<div class="invalid-feedback">
    {{ $message }}
</div>
@enderror
