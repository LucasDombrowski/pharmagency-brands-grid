<?php

require_once pagemarques_path("/includes/helpers/server.php");
require_once pagemarques_path("/includes/api/api.php");

function pagemarques_register_shortcode(){
    add_shortcode("pagemarques",function(){
        $options = get_option("pagemarques_settings");
        $params = [
            "domain"=>isset($options["pagemarques_domain"]) ? $options["pagemarques_domain"] : pagemarques_get_domain(),
            "columns"=>isset($options["pagemarques_columns"]) ? $options["pagemarques_columns"] : 3
        ];
        $data = pagemarques_get_domain_data($params["domain"]);
        ob_start();
        require_once pagemarques_path("/templates/grid/marques-grid.php");
        return ob_get_clean();
    });
}

function pagemarques_enqueue_styles(){
    wp_enqueue_style(
        'pagemarques_style', // Handle
        plugins_url("pagemarques/assets/css/style.css") // URL to the stylesheet
    );
}

add_action("init","pagemarques_register_shortcode");
add_action("wp_enqueue_scripts", "pagemarques_enqueue_styles");

