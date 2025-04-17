<?php

namespace FormForge\Support;

use Illuminate\Support\Facades\View as ViewFacade;
use Illuminate\View\View;
use FormForge\FormBuilder;

class ForgeView
{
    public static function edit(FormBuilder $form, array $data = []): View
    {
        $data['form'] = $form;
        return ViewFacade::make('formforge::edit', $data);
    }
}
