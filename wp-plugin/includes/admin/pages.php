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

    add_settings_field(
        'pagemarques_categories',            // Field ID
        'Catégorisation',          // Title
        function(){
            pagemarques_settings_page_checkbox_render("pagemarques_categories",false,"Afficher les catégories");  ?>
            <div>
                <?=pagemarques_settings_page_color_render("pagemarques_primaryColor","Couleur principale","#000000");?>
                <?=pagemarques_settings_page_color_render("pagemarques_secondaryColor","Couleur secondaire","#FFFFFF");?>
            </div>
            <?php
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_imageSize',            // Field ID
        'Taille des images',          // Title
        function(){
            pagemarques_settings_page_select_render("pagemarques_imageSize", [
                [
                    "label"=>"Small",
                    "value"=>200,
                ],
                [
                    "label"=>"Medium",
                    "value"=>300,
                    "default"=>true
                ],
                [
                    "label"=>"Large",
                    "value"=>500
                ]
                ]);
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_loading',            // Field ID
        'Chargement',          // Title
        function(){
            pagemarques_settings_page_fieldset_render("pagemarques_loading","Méthode de chargement des images",[
                [
                    "label"=>"Lazy Loading",
                    "value"=>"lazy_loading",
                    "default"=>true
                ],
                [
                    "label"=>"Pagination",
                    "value"=>"pagination",
                ]
            ]); ?>
            <div>
                <label for="<?=pagemarques_generate_input_name("pagemarques_paginationLimit");?>">Nombre de marques par page</label>
                <?=pagemarques_settings_page_number_field_render("pagemarques_paginationLimit", 15, 5);?>
            </div>
            <?php
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );
}
add_action('admin_init', 'pagemarques_settings_page_register');

function pagemarques_settings_page_color_render(string $key, string $label, string $default = null){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <input type="color" required name="<?=pagemarques_generate_input_name($key)?>" id="<?=pagemarques_generate_input_name($key)?>" value="<?=esc_attr($option ? $option : $default);?>"/>
    <label for="<?=pagemarques_generate_input_name($key)?>"><?=$label;?></label>
    <?php
}

function pagemarques_settings_page_text_field_render(string $key, string $default = null){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <input type="text" name="<?=pagemarques_generate_input_name($key)?>" value="<?= esc_attr($option ? $option : $default) ?>" required />
    <?php
}

function pagemarques_settings_page_checkbox_render(string $key, bool $default = false, string $label = null, array $show = []){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <input type="checkbox" name="<?=pagemarques_generate_input_name($key)?>" id="<?=pagemarques_generate_input_name($key)?>" value="true" <?= ($option || $default) ? "checked" : "" ?> data-show="<?php
        foreach($show as $inputName){
            echo $inputName." ";
        }
    ?>">
    <?php
    if(isset($label)) : ?>
        <label for="<?=pagemarques_generate_input_name($key)?>"><?=$label?></label>
    <?php endif;
}

function pagemarques_generate_input_name(string $key){
    return "pagemarques_settings[".esc_attr($key)."]";
}

function pagemarques_settings_page_select_render(string $key, array $options){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <select name="pagemarques_settings[<?= esc_attr($key) ?>]" required>
        <?php
        foreach($options as $selectOption):?>
            <option value="<?=$selectOption["value"]?>" <?=(($option !== null && $selectOption["value"] === $option) || $option===null && isset($selectOption["default"])) ? "selected" : ""?>>
                <?=$selectOption["label"]?>
            </option>
        <?php endforeach; ?>
    </select>
    <?php
}

function pagemarques_settings_page_fieldset_render(string $key, string $legend, array $options){
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <fieldset>
        <legend><?=$legend?></legend>
        <?php
        foreach($options as $fieldsetOption): ?>
            <input type="radio" id="<?=$fieldsetOption["value"]?>" value="<?=$fieldsetOption["value"]?>" name="<?=pagemarques_generate_input_name($key)?>" <?=(($option !== null && $fieldsetOption["value"] === $option) || $option===null && isset($fieldsetOption["default"])) ? "checked" : ""?>/>
            <label for="<?=$fieldsetOption["value"]?>"><?=$fieldsetOption["label"]?></label>
        <?php endforeach;?>
    </fieldset>
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
    <input type="number" name="<?=pagemarques_generate_input_name($key)?>" id="<?=pagemarques_generate_input_name($key)?>" value="<?= esc_attr($option ? $option : $default) ?>" required min="<?= esc_attr($min) ?>" max="<?= esc_attr($max) ?>" />
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
    $sanitized_input["pagemarques_categories"] = isset($input["pagemarques_categories"]);
    if(isset($input["pagemarques_imageSize"])){
        $parsedInteger = absint($input["pagemarques_imageSize"]);
        $sanitized_input["pagemarques_imageSize"] = (in_array($parsedInteger, [200,300,500])) ? $parsedInteger : 300;
    }
    if(isset($input["pagemarques_primaryColor"])){
        $sanitized_input["pagemarques_primaryColor"] = sanitize_hex_color($input["pagemarques_primaryColor"]);
    }
    if(isset($input["pagemarques_secondaryColor"])){
        $sanitized_input["pagemarques_secondaryColor"] = sanitize_hex_color($input["pagemarques_secondaryColor"]);
    }
    if(isset($input["pagemarques_loading"])){
        $sanitized_input["pagemarques_loading"] = (in_array($input["pagemarques_loading"],["lazy_loading","pagination"])) ? $input["pagemarques_loading"] : "lazy_loading";
    }
    if(isset($input['pagemarques_paginationLimit'])) {
        $parsedInteger = absint($input['pagemarques_paginationLimit']);
        $sanitized_input['pagemarques_paginationLimit'] = ($parsedInteger >= 5) ? $parsedInteger : 15;
    }
    return $sanitized_input;
}

add_action('admin_menu', 'pagemarques_generate_admin_pages');

?>


