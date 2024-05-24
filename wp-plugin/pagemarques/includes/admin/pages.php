<?php

require_once pagemarques_path("/includes/helpers/server.php");

function pagemarques_generate_admin_pages() {
    add_menu_page(
        "Page Marques",        // Page title
        "Page Marques",        // Menu title
        "manage_options",      // Capability
        "page-marques",        // Menu slug
        "pagemarques_settings_page_render", // Callback function
        "dashicons-grid-view"  // Icon
    );
}

function pagemarques_settings_page_render() {
    require_once pagemarques_path("/templates/admin/settings.php");
}

function pagemarques_settings_page_register() {
    register_setting(
        'pagemarques_settings_general',  // Option group
        'pagemarques_settings',          // Option name
        'pagemarques_settings_sanitize'  // Sanitize callback
    );

    add_settings_section(
        'pagemarques_general',            // Section ID
        'Paramètres généraux',            // Title
        "",                                // Callback
        'page-marques'                    // Page slug
    );

    add_settings_field(
        'pagemarques_domain',             // Field ID
        'Domaine',                        // Title
        function(){
            pagemarques_settings_page_text_field_render("pagemarques_domain", pagemarques_get_domain());
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_columns',            // Field ID
        'Colonnes de la grille',          // Title
        function(){
            pagemarques_settings_page_number_field_render("pagemarques_columns", 3, 1, 10);
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );
}
add_action('admin_init', 'pagemarques_settings_page_register');

function pagemarques_settings_page_text_field_render(string $key, string $default = null){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <input type="text" name="pagemarques_settings[<?= esc_attr($key) ?>]" value="<?= esc_attr($option ? $option : $default) ?>" required />
    <?php
}

function pagemarques_settings_page_get_option(string $key){
    $options = get_option('pagemarques_settings');
    $option = isset($options[$key]) ? $options[$key] : null;
    return $option;
}

function pagemarques_settings_page_number_field_render(string $key, int $default = null, int $min = null, int $max = null){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <input type="number" name="pagemarques_settings[<?= esc_attr($key) ?>]" value="<?= esc_attr($option ? $option : $default) ?>" required min="<?= esc_attr($min) ?>" max="<?= esc_attr($max) ?>" />
    <?php
}

function pagemarques_settings_sanitize($input) {
    $sanitized_input = array();
    if(isset($input['pagemarques_domain'])) {
        $sanitized_input['pagemarques_domain'] = sanitize_text_field($input['pagemarques_domain']);
    }
    if(isset($input['pagemarques_columns'])) {
        $parsedInteger = absint($input['pagemarques_columns']);
        $sanitized_input['pagemarques_columns'] = ($parsedInteger >= 1) ? $parsedInteger : 3;
    }
    return $sanitized_input;
}

add_action('admin_menu', 'pagemarques_generate_admin_pages');

?>


