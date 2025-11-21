<div class="row">
    @foreach ($components as $component)
        <div class="col-md-6 col-xs-12">
            {{ $component->render() }}
        </div>
    @endforeach
</div>
