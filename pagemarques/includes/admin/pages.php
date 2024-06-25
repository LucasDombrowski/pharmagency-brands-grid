<?php
require_once pagemarques_path("/includes/helpers/server.php");

function pagemarques_generate_admin_pages()
{
    add_menu_page(
        "Page Marques",        // Page title
        "Page Marques",        // Menu title
        "manage_options",      // Capability
        "page-marques",        // Menu slug
        "pagemarques_settings_page_render", // Callback function
        "dashicons-grid-view"  // Icon
    );
}

function pagemarques_settings_page_render()
{
    require_once pagemarques_path("/templates/admin/settings.php");
}

function pagemarques_settings_page_register()
{
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
        function () {
            pagemarques_settings_page_text_field_render("pagemarques_domain", pagemarques_get_domain());
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_columns',            // Field ID
        'Colonnes de la grille',          // Title
        function () { ?>
        <div>
            <div class="pagemarques-class-input">
                <?= pagemarques_settings_page_number_field_render("pagemarques_columnsComputer", 6, 1, null, "Ordinateur"); ?>
            </div>
            <div class="pagemarques-class-input">
                <?= pagemarques_settings_page_number_field_render("pagemarques_columnsTablet", 2, 1, null, "Tablette"); ?>
            </div>
            <div class="pagemarques-class-input">
                <?= pagemarques_settings_page_number_field_render("pagemarques_columnsMobile", 1, 1, null, "Téléphone"); ?>
            </div>
        </div>
    <?php
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        "pagemarques_gridGap",
        "Espacement de la grille",
        function () {
            pagemarques_settings_page_number_field_render("pagemarques_gridGap", 16, 0, null);
        },
        "page-marques",
        "pagemarques_general"
    );

    add_settings_field(
        "pagemarques_borderRadius",
        "Arrondissement des boutons",
        function () {
            pagemarques_settings_page_number_field_render("pagemarques_borderRadius", 3, 0, null);
        },
        "page-marques",
        "pagemarques_general"
    );

    add_settings_field(
        'pagemarques_categories',            // Field ID
        'Catégorisation',          // Title
        function () {
            pagemarques_settings_page_checkbox_render("pagemarques_categories", false, "Afficher les catégories");  ?>
        <div class="pagemarques-hidden" id="pagemarques-main-colors">
            <?= pagemarques_settings_page_color_render("pagemarques_primaryColor", "Couleur principale", "#FFFFFF"); ?>
            <?= pagemarques_settings_page_color_render("pagemarques_secondaryColor", "Couleur secondaire", "#089800"); ?>
        </div>
    <?php
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_imageSize',            // Field ID
        'Taille des images',          // Title
        function () {
            pagemarques_settings_page_select_render("pagemarques_imageSize", [
                [
                    "label" => "Small",
                    "value" => 200,
                ],
                [
                    "label" => "Medium",
                    "value" => 300,
                    "default" => true
                ],
                [
                    "label" => "Large",
                    "value" => 500
                ]
            ]);
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_cssClasses',            // Field ID
        'Classes css additionnelles',          // Title
        function () {
            $key = "pagemarques_cssClasses";
    ?>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Conteneur global (grid)", false, "grid_container") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Conteneur image", false, "image_container") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Image", false, "image") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Boutons", false, "button") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Label de catégorie", false, "category_label") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Bouton de pagination", false, "pagination_button") ?>
        </div>
        <div class="pagemarques-class-input">
            <?= pagemarques_settings_page_text_field_render($key, null, "Index de pagination", false, "pagination_index") ?>
        </div>
    <?php
        },
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );

    add_settings_field(
        'pagemarques_loading',            // Field ID
        'Chargement',          // Title
        function () {
            pagemarques_settings_page_fieldset_render("pagemarques_loading", "Méthode de chargement des images", [
                [
                    "label" => "Lazy Loading",
                    "value" => "lazy_loading",
                    "default" => true
                ],
                [
                    "label" => "Pagination",
                    "value" => "pagination",
                ]
            ]); ?>
        <div class="pagemarques-number-label-input pagemarques-hidden" id="pagemarques-pagination-limit-input">
            <label for="<?= pagemarques_generate_input_name("pagemarques_paginationLimit"); ?>">Nombre de marques par page</label>
            <?= pagemarques_settings_page_number_field_render("pagemarques_paginationLimit", 15, 5); ?>
        </div>
    <?php
        }, // Callback
        'page-marques',                   // Page slug
        'pagemarques_general'             // Section ID
    );
}
add_action('admin_init', 'pagemarques_settings_page_register');

function pagemarques_settings_page_color_render(string $key, string $label, string $default = null)
{
    $option = pagemarques_settings_page_get_option($key);
    $input_id = pagemarques_generate_input_name($key);
    $color_value = esc_attr($option ? $option : $default);
    ?>
    <div class="pagemarques-color-input">
        <label for="<?= $input_id ?>"><?= $label; ?></label>
        <div>
            <input type="color" required name="<?= $input_id ?>" id="<?= $input_id ?>" value="<?= $color_value; ?>" oninput="syncHexColor('<?= $input_id ?>')" />
            <input type="text" name="<?= $input_id ?>_hex" id="<?= $input_id ?>_hex" value="<?= $color_value; ?>" pattern="^#([A-Fa-f0-9]{6})$" oninput="syncColorPicker('<?= $input_id ?>')" />
        </div>
    </div>
    <?php
}

function pagemarques_settings_page_text_field_render(string $key, string $default = null, string $label = null, bool $required = true, string $subKey = null)
{
    $option = pagemarques_settings_page_get_option($key, $subKey);
    $inputName = pagemarques_generate_input_name($key);
    if (isset($subKey)) {
        $inputName = $inputName . "[" . $subKey . "]";
    }
    if (isset($label)) : ?>
        <label for="<?= $inputName ?>"><?= $label ?></label>
    <?php endif; ?>
    <input type="text" id="<?= $inputName ?>" name="<?= $inputName ?>" value="<?= esc_attr($option ? $option : $default) ?>" <?= $required ? "required" : "" ?> />
<?php
}

function pagemarques_settings_page_checkbox_render(string $key, bool $default = false, string $label = null, array $show = [])
{
    $option = pagemarques_settings_page_get_option($key);
?>
    <input type="checkbox" name="<?= pagemarques_generate_input_name($key) ?>" id="<?= pagemarques_generate_input_name($key) ?>" value="true" <?= ($option || $default) ? "checked" : "" ?> data-show="<?php
                                                                                                                                                                                                    foreach ($show as $inputName) {
                                                                                                                                                                                                        echo $inputName . " ";
                                                                                                                                                                                                    }
                                                                                                                                                                                                    ?>">
    <?php
    if (isset($label)) : ?>
        <label for="<?= pagemarques_generate_input_name($key) ?>"><?= $label ?></label>
    <?php endif;
}

function pagemarques_generate_input_name(string $key)
{
    return "pagemarques_settings[" . esc_attr($key) . "]";
}

function pagemarques_settings_page_select_render(string $key, array $options)
{
    $option = pagemarques_settings_page_get_option($key);
    ?>
    <select name="<?= pagemarques_generate_input_name($key) ?>" id="<?= pagemarques_generate_input_name($key) ?>" required>
        <?php
        foreach ($options as $selectOption) : ?>
            <option value="<?= $selectOption["value"] ?>" <?= (($option !== null && $selectOption["value"] === $option) || $option === null && isset($selectOption["default"])) ? "selected" : "" ?>>
                <?= $selectOption["label"] ?>
            </option>
        <?php endforeach; ?>
    </select>
<?php
}

function pagemarques_settings_page_fieldset_render(string $key, string $legend, array $options)
{
    $option = pagemarques_settings_page_get_option($key);
    $inputName = pagemarques_generate_input_name($key);
?>
    <fieldset class="pagemarques-fieldset">
        <legend><?= $legend ?></legend>
        <div class="pagemarques-radio-inputs-container">
            <?php
            foreach ($options as $fieldsetOption) : ?>
                <div class="pagemarques-radio-input">
                    <input type="radio" id="<?= $inputName . "-" . $fieldsetOption["value"] ?>" value="<?= $fieldsetOption["value"] ?>" name="<?= pagemarques_generate_input_name($key) ?>" <?= (($option !== null && $fieldsetOption["value"] === $option) || $option === null && isset($fieldsetOption["default"])) ? "checked" : "" ?> />
                    <label for="<?= $inputName . "-" . $fieldsetOption["value"] ?>"><?= $fieldsetOption["label"] ?></label>
                </div>
            <?php endforeach; ?>
        </div>
    </fieldset>
    <?php
}

function pagemarques_settings_page_get_option(string $key, string $subKey = null)
{
    $options = get_option('pagemarques_settings');
    if (isset($subKey)) {
        $option = isset($options[$key][$subKey]) ? $options[$key][$subKey] : null;
    } else {
        $option = isset($options[$key]) ? $options[$key] : null;
    }
    return $option;
}

function pagemarques_settings_page_number_field_render(string $key, int $default = null, int $min = null, int $max = null, string $label = null)
{
    $option = pagemarques_settings_page_get_option($key);
    if (isset($label)) : ?>
        <label for="<?= pagemarques_generate_input_name($key) ?>"><?= $label ?></label>
    <?php endif; ?>
    <input type="number" name="<?= pagemarques_generate_input_name($key) ?>" id="<?= pagemarques_generate_input_name($key) ?>" value="<?= esc_attr($option ? $option : $default) ?>" required min="<?= esc_attr($min) ?>" max="<?= esc_attr($max) ?>" />
<?php
}

function pagemarques_settings_sanitize($input)
{
    $sanitized_input = array();
    error_log(print_r($input, true));
    if (isset($input['pagemarques_domain'])) {
        $sanitized_input['pagemarques_domain'] = sanitize_text_field($input['pagemarques_domain']);
    }
    if (isset($input['pagemarques_columnsComputer'])) {
        $parsedInteger = absint($input['pagemarques_columnsComputer']);
        $sanitized_input['pagemarques_columnsComputer'] = ($parsedInteger >= 1) ? $parsedInteger : 3;
    }
    if (isset($input['pagemarques_columnsTablet'])) {
        $parsedInteger = absint($input['pagemarques_columnsTablet']);
        $sanitized_input['pagemarques_columnsTablet'] = ($parsedInteger >= 1) ? $parsedInteger : 2;
    }
    if (isset($input['pagemarques_columnsMobile'])) {
        $parsedInteger = absint($input['pagemarques_columnsMobile']);
        $sanitized_input['pagemarques_columnsMobile'] = ($parsedInteger >= 1) ? $parsedInteger : 1;
    }
    if (isset($input['pagemarques_gridGap'])) {
        $parsedInteger = absint($input['pagemarques_gridGap']);
        $sanitized_input['pagemarques_gridGap'] = ($parsedInteger >= 0) ? $parsedInteger : 16;
    }
    if (isset($input['pagemarques_borderRadius'])) {
        $parsedInteger = absint($input['pagemarques_borderRadius']);
        $sanitized_input['pagemarques_borderRadius'] = ($parsedInteger >= 0) ? $parsedInteger : 3;
    }
    $sanitized_input["pagemarques_categories"] = isset($input["pagemarques_categories"]);
    if (isset($input["pagemarques_imageSize"])) {
        $parsedInteger = absint($input["pagemarques_imageSize"]);
        $sanitized_input["pagemarques_imageSize"] = (in_array($parsedInteger, [200, 300, 500])) ? $parsedInteger : 300;
    }
    if (isset($input["pagemarques_primaryColor"])) {
        $sanitized_input["pagemarques_primaryColor"] = sanitize_hex_color($input["pagemarques_primaryColor"]);
    }
    if (isset($input["pagemarques_secondaryColor"])) {
        $sanitized_input["pagemarques_secondaryColor"] = sanitize_hex_color($input["pagemarques_secondaryColor"]);
    }
    if (isset($input["pagemarques_loading"])) {
        $sanitized_input["pagemarques_loading"] = (in_array($input["pagemarques_loading"], ["lazy_loading", "pagination"])) ? $input["pagemarques_loading"] : "lazy_loading";
    }
    if (isset($input['pagemarques_paginationLimit'])) {
        $parsedInteger = absint($input['pagemarques_paginationLimit']);
        $sanitized_input['pagemarques_paginationLimit'] = ($parsedInteger >= 5) ? $parsedInteger : 15;
    }
    if (isset($input["pagemarques_cssClasses"])) {
        $cssClasses = $input["pagemarques_cssClasses"];
        $sanitizedCssClasses = [];
        if (isset($cssClasses["grid_container"])) {
            $sanitizedCssClasses["grid_container"] = sanitize_text_field($cssClasses["grid_container"]);
        }
        if (isset($cssClasses["image_container"])) {
            $sanitizedCssClasses["image_container"] = sanitize_text_field($cssClasses["image_container"]);
        }
        if (isset($cssClasses["image"])) {
            $sanitizedCssClasses["image"] = sanitize_text_field($cssClasses["image"]);
        }
        if (isset($cssClasses["category_label"])) {
            $sanitizedCssClasses["category_label"] = sanitize_text_field($cssClasses["category_label"]);
        }
        if (isset($cssClasses["pagination_button"])) {
            $sanitizedCssClasses["pagination_button"] = sanitize_text_field($cssClasses["pagination_button"]);
        }
        if (isset($cssClasses["pagination_index"])) {
            $sanitizedCssClasses["pagination_index"] = sanitize_text_field($cssClasses["pagination_index"]);
        }
        if (isset($cssClasses["button"])) {
            $sanitizedCssClasses["button"] = sanitize_text_field($cssClasses["button"]);
        }
        if (!empty($sanitizedCssClasses)) {
            $sanitized_input["pagemarques_cssClasses"] = $sanitizedCssClasses;
        }
    }
    return $sanitized_input;
}

function pagemarques_settings_page_enqueue_assets()
{
    $assetsFolder = plugin_dir_url(__FILE__) . '../../assets';
    wp_enqueue_style("pagemarques_admin_css", $assetsFolder . "/css/admin-page.css");
    wp_enqueue_script("pagemarques_admin_js", $assetsFolder . "/js/admin-page.js");
    wp_enqueue_script("pagemarques_grid_live_update", $assetsFolder . "/js/grid-live-update.js");
}

add_action('admin_menu', 'pagemarques_generate_admin_pages');
add_action("admin_enqueue_scripts", "pagemarques_settings_page_enqueue_assets");
