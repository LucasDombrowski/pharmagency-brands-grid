<?php

function pagemarques_get_domain(){
    return $_SERVER["HTTP_HOST"];
}

function pagemarques_get_api_server(){
    return "http://localhost:8000/api";
}