@php
    $nominal = $method==='GET' ? 'GET':'POST';
@endphp

<form id="{{ $id ? $id:'' }}" action="{{ $action ? $action:'' }}" method="{{ $nominal }}" class="col-md-12 formforge-form formforge-{{ $template }}{{ $classes ? ' '.$classes:''  }}" enctype="multipart/form-data">
    @method($method)
    @csrf
    <div class="row align-items-center">
        @foreach ($components as $component)
            @if (isset($component->type) && $component->type === 'hidden')
                {{ $component->render() }}
            @else
                <div class="col-md-6 col-xs-12 form-group">
                    <div class="d-flex">
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

        @endforeach
    </div>
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
