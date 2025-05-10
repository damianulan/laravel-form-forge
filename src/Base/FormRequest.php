<?php

namespace FormForge\Base;

use Illuminate\Foundation\Http\FormRequest as Request;
use FormForge\Base\Form;

class FormRequest extends Request
{

    public Form $form;

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
