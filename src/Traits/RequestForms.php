<?php

namespace FormForge\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request as RequestFacade;

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
     * Retrieves model attributes from request and assigns them to the instance.
     *
     * @param  mixed  $id
     */
    public static function fillFromRequest($modelKey = null, ?Request $request = null): static
    {
        $instance = null;
        if (is_null($modelKey)) {
            $instance = new static();
        } else {
            $instance = static::find($modelKey);
        }
        $inputs = array();
        if ($request) {
            $inputs = $request->all();
        } else {
            $inputs = RequestFacade::all();
        }

        foreach ($inputs as $property => $value) {
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

                if(in_array($value, ['on', 'off'])){
                    $value = $value === 'on' ? 1:0;
                }

                if (isset($instance->casts, $instance->casts[$property])) {
                    if ('boolean' === $instance->casts[$property]) {
                        $instance->{$property} = (bool) $value;
                    }
                }
            }
        }

        $personstamps = config('formforge.personstamps.fields');

        if ($personstamps && ! empty($personstamps)) {
            foreach ($personstamps as $property) {
                if (in_array('property', $instance->fillable) || empty($instance->fillable)) {
                    $instance->property = Auth::user()->id;
                }
            }
        }

        return $instance;
    }
}
