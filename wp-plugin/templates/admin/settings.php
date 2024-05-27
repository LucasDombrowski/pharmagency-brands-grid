<div>
    <h1>Page marques</h1>
    <form method="post" action="options.php" id="pagemarques-options-form">
        <?php   
        settings_fields("pagemarques_settings_general");
        do_settings_sections("page-marques");
        submit_button();
        ?>
    </form>
    <?php echo do_shortcode("[pagemarques]");?>
</div>