<?php

require_once pagemarques_path("/includes/helpers/server.php");
require_once pagemarques_path("/includes/api/api.php");

function pagemarques_register_shortcode() {
    add_shortcode("pagemarques", function() {
        return "<div id='pagemarques-react-app'></div>";
    });
}

function pagemarques_enqueue_react_script() {
    $options = get_option("pagemarques_settings");
    $params = [
        "domain" => isset($options["pagemarques_domain"]) ? $options["pagemarques_domain"] : pagemarques_get_domain(),
        "columns" => isset($options["pagemarques_columns"]) ? $options["pagemarques_columns"] : 3,
        "displayCategories" => isset($options["pagemarques_categories"]) ? $options["pagemarques_categories"] : false,
        "primaryColor" => isset($options["pagemarques_primaryColor"]) ? $options["pagemarques_primaryColor"] : "#000000",
        "secondaryColor"=>isset($options["pagemarques_secondaryColor"]) ? $options["pagemarques_secondaryColor"] : "#FFFFFF",
        "imageSize"=>isset($options["pagemarques_imageSize"]) ? $options["pagemarques_imageSize"] : 300,
        "loading"=>isset($options["pagemarques_loading"]) ? $options["pagemarques_loading"] : "lazy_loading",
        "paginationLimit"=>isset($options["pagemarques_paginationLimit"]) ? $options["pagemarques_paginationLimit"] : 15,
        "cssClasses"=>isset($options["pagemarques_cssClasses"]) ? $options["pagemarques_cssClasses"] : []
    ];
    $data = pagemarques_get_domain_data($params["domain"]);
    pagemarques_init_react_script([
        "data" => $data,
        "params" => $params
    ]);
}

function pagemarques_init_react_script(array $array) {
    wp_enqueue_script(
        'pagemarques-react-app',
        plugin_dir_url(__FILE__) . 'build/static/js/main.js',
        array('wp-element'), // Ensures wp-element (React) is loaded
        '1.0',
        true
    );
    wp_enqueue_style(
        'pagemarques-react-app-style',
        plugin_dir_url(__FILE__) . 'build/static/css/main.css',
        array(), // Dependencies, if any
        null // Version
    );
    wp_localize_script("pagemarques-react-app", "pageMarquesReactData", $array);
}

// Hook for front-end
add_action('wp_enqueue_scripts', "pagemarques_enqueue_react_script");
// Hook for admin
add_action("admin_enqueue_scripts", "pagemarques_enqueue_react_script");

add_action("init", "pagemarques_register_shortcode");


