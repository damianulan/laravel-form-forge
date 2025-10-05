<label for="id_{{ $name }}" class="col-form-label formforge-label{{ $required ? ' required':'' }}">
    {{ $label }}
    @if($key)
        <div class="text-muted formforge-key">{{ '[' . $key . ']' }}</div>
    @endif
</label>
