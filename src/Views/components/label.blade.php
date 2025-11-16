<label for="id_{{ $name }}" class="col-form-label formforge-label{{ $required ? ' required':'' }}">
    {{ $label }}
</label>
@if($key)
    <div class="text-muted formforge-key">{{ $key }}</div>
@endif
