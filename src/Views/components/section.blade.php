<div class="formforge-section">
    <h4 class="formforge-section__title">{{ $component->title }}</h4>
    <div class="formforge-section__content">
        @foreach($component->components as $component)
                @include('formforge::templates.components.' . $template, ['component' => $component])
        @endforeach
    </div>
</div>
