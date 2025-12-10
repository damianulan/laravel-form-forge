<?php

if(!function_exists('clean_html')){
    function clean_html(?string $input): string
    {
        $output = '';
        if($input){
            $output = $input;
        }
        return $output;
    }
}
