@php
    $nominal = $method==='GET' ? 'GET':'POST';
@endphp

@include('formforge::pre')
<form id="{{ $id ? $id:'' }}" action="{{ $action ? $action:'' }}" method="{{ $nominal }}" class="col-md-12 formforge-form formforge-{{ $template }}{{ $classes ? ' '.$classes:''  }}" enctype="multipart/form-data">
    @method($method)
    @csrf
    @foreach ($components as $component)
        @if (isset($component->type) && $component->type === 'hidden')
            {{ $component->render() }}
        @else
            <div class="row form-group align-items-center">
                <div class="col-md-4">
                    <div class="d-flex">
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

    @endforeach
    @if ($submit || !empty($buttons))
        <div class="row">
            <div class="action-btns">
                @if(!empty($buttons))
                    @foreach($buttons as $button)
                        {{ $button->render() }}
                    @endforeach
                @endif
                @if($submit)
                    {{ $submit->render() }}
                @endif
            </div>
        </div>
    @endif
</form>
@include('formforge::post')
