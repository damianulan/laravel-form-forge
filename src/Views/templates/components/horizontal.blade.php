@if (isset($component->type) && $component->type === 'hidden')
    {{ $component->render() }}
@else
    <div class="row form-group formforge-component">
        <div class="col-md-4">
            <div class="formforge-input-row">
                <div class="form-label">
                    {{ $component->getLabel() }}
                </div>
                <div class="form-info">
                    {!! $component->getInfos() !!}
                </div>
            </div>
        </div>
        <div class="col-md-8">
            {{ $component->render() }}
        </div>
    </div>
@endif
