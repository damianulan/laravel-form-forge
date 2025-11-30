@php
    $nominal = $method==='GET' ? 'GET':'POST';
@endphp

@include('formforge::pre')
<form id="{{ $id ? $id:'' }}" action="{{ $action ? $action:'' }}" method="{{ $nominal }}" class="col-md-12 formforge-form formforge-{{ $template }}{{ $classes ? ' '.$classes:''  }}" enctype="multipart/form-data">
    @method($method)
    @csrf
    @foreach ($components as $component)
        @if($component instanceof \FormForge\Components\ForgeComponent)
            @include('formforge::templates.components.' . $template, ['component' => $component])
        @elseif ($component instanceof \FormForge\Components\ForgeSection)
                @include('formforge::components.section', ['component' => $component, 'template' => $template])
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
