<?php

namespace FormForge\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

trait RequestForms
{
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
                    $file = $request->file($property);
                    if ($file && isset($instance->storagePath)) {
                        $name = $file->hashName();
                        $stored = $file->storeAs("public/$instance->storagePath", $name);
                        if ($stored) {
                            $publicPath = $instance->storagePath . '/' . $name;
                            $instance->$property = $publicPath;
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
            }
        }

        if (in_array('created_by', $instance->fillable)) {
            $instance->created_by = Auth::user()->id;
        }

        return $instance;
    }
}
