@if (isset($component->type) && $component->type === 'hidden')
    {{ $component->render() }}
@else
    <div class="col-md-6 col-xs-12 form-group formforge-component">
        <div class="formforge-input-row">
            <div class="form-label">
                {{ $component->getLabel() }}
            </div>
            <div class="form-info">
                {!! $component->getInfos() !!}
            </div>
        </div>
        <div class="d-block">
            {{ $component->render() }}
        </div>
    </div>

@endif
