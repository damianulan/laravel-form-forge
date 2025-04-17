@props(['id', 'name', 'toolbar', 'value' => ''])
@php
    $classes = 'trix-content form-control';
    if($errors->has($name)){
        $classes .= ' is-invalid';
    }
@endphp
<input
    type="hidden"
    name="{{ $name }}"
    id="{{ $id }}"
    value="{!! $value !!}"
/>
<trix-toolbar class="trix-toolbar" id="trix-toolbar-{{ $toolbar }}">
    <div class="trix-button-row">
        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-bold"
        data-trix-attribute="bold"
        data-trix-key="b"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.bold') }}"
        ><i class="bi-type-bold"></i></button>

        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-italic"
        data-trix-attribute="italic"
        data-trix-key="i"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.italic') }}"
        ><i class="bi-type-italic"></i></button>

        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-link"
        data-trix-attribute="href"
        data-trix-action="link"
        data-trix-key="k"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.hiperlink') }}"
        ><i class="bi-link-45deg"></i></button>

        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-quote ms-2"
        data-trix-attribute="quote"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.quote') }}"
        ><i class="bi-quote"></i></button>

        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-bullet-list"
        data-trix-attribute="bullet"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.li') }}"
        ><i class="bi-list-ul"></i></button>

        <button type="button"
        class="btn btn-outline-secondary trix-btn trix-button--icon-number-list"
        data-trix-attribute="number"
        tabindex="-1"
        data-tippy-content="{{ __('vocabulary.typography.ol') }}"
        ><i class="bi-list-ol"></i></button>
    </div>
    <div class="trix-dialogs" data-trix-dialogs="">
        <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
          <div class="trix-dialog__link-fields">
            <input type="url" name="href" class="form-control trix-input trix-input--dialog" placeholder="{{ __('vocabulary.enter_address') }}" aria-label="URL" required="" data-trix-input="" disabled="disabled">
            <div class="trix-button-group">
              <input type="button" class="btn trix-button trix-button--dialog" value="{{ __('vocabulary.typography.link') }}" data-trix-method="setAttribute">
              <input type="button" class="btn trix-button trix-button--dialog" value="{{ __('vocabulary.typography.unlink') }}" data-trix-method="removeAttribute">
            </div>
          </div>
        </div>
    </div>

</trix-toolbar>
<trix-editor
    id="{{ $id }}"
    input="{{ $id }}"
    toolbar="trix-toolbar-{{ $toolbar }}"
    {{ $attributes->merge(['class' => $classes]) }}
></trix-editor>
