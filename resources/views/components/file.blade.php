<div class="input-group formforge-file-group">
    <label class="input-group-text" for="id{{ $component->name }}">{{ __('buttons.choose_file') }}</label>
    <input type="file" class="formforge-file {{ $classes ? $classes:'' }}@error($component->name) is-invalid @enderror" id="id_{{ $component->name }}"
    name="{{ $component->name }}" accept="{{ $component->getExt() }}"
    {{ $component->required ? ' required':'' }}{{ $component->readonly ? ' readonly':'' }}{{ $component->disabled ? ' disabled':'' }}{{ $component->multiple ? ' multiple':'' }}
    >
    @error($component->name)
    <div class="invalid-feedback">
        {{ $message }}
    </div>
    @enderror
    @if($component->hasValue)
    <div class="input-snippet text-muted">
        {{ __('formforge::components.file.override_info') }}
    </div>
    @endif
</div>
