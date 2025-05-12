<?php

namespace FormForge\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

/**
 * Use this trait in your model to be able to automatically fill it based on request data.
 *
 * @author Damian Ułan <damian.ulan@protonmail.com>
 * @copyright 2025 damianulan
 * @license MIT
 * @package FormForge
 */
trait RequestForms
{

    /**
     * default storage path for files uploaded with request.
     * can be overriden in model.
     *
     * @var string
     */
    protected $storagePath = 'uploads';

    /**
     * Retrieve model data from request
     *
     * @param \Illuminate\Http\Request $request
     * @param mixed                    $id
     * @return static
     */
    public static function fillFromRequest(Request $request, $id = null): static
    {
        $instance = null;
        if (is_null($id)) {
            $instance = new static();
        } else {
            $instance = static::find($id);
        }
        foreach ($request->all() as $property => $value) {
            if (in_array($property, $instance->fillable)) {
                // FILE
                if ($value instanceof UploadedFile) {
                    if (config('formforge.handling_files')) {
                        $file = $request->file($property);
                        if ($file && isset($instance->storagePath)) {
                            $name = $file->hashName();
                            $stored = $file->storeAs("public/$instance->storagePath", $name);
                            if ($stored) {
                                $publicPath = $instance->storagePath . '/' . $name;
                                $instance->$property = $publicPath;
                            }
                        }
                    }
                } else {
                    // ALL ELSE
                    if (!is_array($value)) {
                        $value = trim($value);
                        if (empty($value)) {
                            $value = NULL;
                        }
                    }

                    $instance->$property = $value;
                }

                if (isset($instance->casts) && isset($instance->casts[$property])) {
                    if ($instance->casts[$property] === 'boolean') {
                        $instance->$property = (bool)$value;
                    }
                }
            }
        }

        if (in_array('created_by', $instance->fillable)) {
            $instance->created_by = Auth::user()->id;
        }

        return $instance;
    }
}
