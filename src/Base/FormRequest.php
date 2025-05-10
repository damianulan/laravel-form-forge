<?php

namespace FormForge\Base;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest as BaseFormRequest;
use FormForge\Base\Form;

class FormRequest extends BaseFormRequest
{

    public Form $form;

    public static function make(Request $request, Form $form): FormRequest
    {
        $new = self::create([
            $request->getUri(),
            $request->getMethod(),
            $request->all(),
            $request->cookies->all(),
            $request->allFiles(),
            $request->server->all(),
            $request->getContent()
        ]);
        $new->form = $form;
        return $new;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->form::authorize($this);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $id = $this->input('id') ?? null;
        return $this->form::validation($this, $id);
    }
}
