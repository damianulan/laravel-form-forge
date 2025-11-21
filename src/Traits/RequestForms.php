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
     * @param  mixed  $id
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
                            $stored = $file->storeAs("public/{$instance->storagePath}", $name);
                            if ($stored) {
                                $publicPath = $instance->storagePath . '/' . $name;
                                $instance->{$property} = $publicPath;
                            }
                        }
                    }
                } else {
                    // ALL ELSE
                    if ( ! is_array($value)) {
                        $value = trim($value);
                        if (empty($value)) {
                            $value = null;
                        }
                    }

                    $instance->{$property} = $value;
                }

                if (isset($instance->casts, $instance->casts[$property])) {
                    if ('boolean' === $instance->casts[$property]) {
                        $instance->{$property} = (bool) $value;
                    }
                }
            }
        }

        $personstamps = config('formforge.personstamps');

        if ($personstamps && ! empty($personstamps)) {
            foreach ($personstamps as $property) {
                if (in_array('property', $instance->fillable)) {
                    $instance->property = Auth::user()->id;
                }
            }
        }

        return $instance;
    }
}
