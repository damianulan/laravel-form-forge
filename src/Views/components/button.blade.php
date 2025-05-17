@if($component->type)
    @if($component->type === 'a')
        <a class="{{ $component->class }}" href="{{ !empty($component->href) ? $component->href:'' }}" {{ $component->disabled ? 'disabled':'' }}>{{ !empty($component->title) ? $component->title:'' }}</a>
    @else
        <button type="{{ !empty($component->type) ? $component->type:'' }}" class="{{ $component->class }}" {{ $component->disabled ? 'disabled':'' }}>{{ !empty($component->title) ? $component->title:'' }}</button>
    @endif
@endif
