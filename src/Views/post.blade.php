@php
    if(config('formforge.dispatches_events')){
        $event::dispatch($form, $method, $components);
    }
@endphp