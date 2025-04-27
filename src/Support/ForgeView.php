<?php

namespace FormForge\Support;

use Illuminate\View\View;
use FormForge\FormBuilder;

class ForgeView
{
    public static function edit(FormBuilder $form, array $data = []): View
    {
        $data['form'] = $form;
        return view('formforge::edit', $data);
    }
}
