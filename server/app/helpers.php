<?php
if(!function_exists("parseBrandName")){
    function parseBrandName(string $brandName){
        $lower = strtolower($brandName);
        $string = str_replace(' ', '-', $lower);
        $string = preg_replace('/[^A-Za-z0-9\-]/', '', $string);
        if(substr($string,-1)==="-"){
            $string = rtrim($string,"-");
        }
        return $string;
    }
}
?>