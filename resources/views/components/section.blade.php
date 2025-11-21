<div class="formforge-section">
    <h4 class="formforge-section__title">{{ $component->getTitle() }}</h4>
    <div class="formforge-section__content">
        @foreach($component->getComponents() as $component)
                @include('formforge::templates.components.' . $template, ['component' => $component])
        @endforeach
    </div>
</div>
