@props(['component'])
@if (isset($component->type) && $component->type === 'hidden')
    {{ $component->render() }}
@else
    <div class="row form-group formforge-component">
        <div class="col-12">
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
    </div>
@endif
