@php
    $nominal = $method==='GET' ? 'GET':'POST';
@endphp

<form id="{{ $id ? $id:'' }}" action="{{ $action ? $action:'' }}" method="{{ $nominal }}" class="col-md-12 form-{{ $template }}{{ $classes ? ' '.$classes:''  }}" enctype="multipart/form-data">
    @method($method)
    @csrf
    @foreach ($components as $component)
        @if (isset($component->type) && $component->type === 'hidden')
            {{ $component->render() }}
        @else
            <div class="row pb-3">
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
    @if ($submit)
        <div class="row">
            <div class="action-btns">
               {{ $submit->render() }}
            </div>
        </div>
    @endif
</form>
