<?php
/*
Plugin Name: Page Marques Pharmagency
Plugin URI: http://localhost:8000/
Description: Plugin d'intégration pour les pages marques de pharmacies.
Author: Lucas Dombrowski
Version: 1.0.0
Author URI: https://lucasdombrowski.com/
*/
function pagemarques_path(string $path){
    return plugin_dir_path(__FILE__).$path;
}

include_once pagemarques_path("/includes/admin/pages.php");
include_once pagemarques_path("/includes/shortcodes/shortcodes.php");

