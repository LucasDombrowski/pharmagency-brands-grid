<div>
    <h1>Page marques</h1>
    <form method="post" action="options.php">
        <?php   
        settings_fields("pagemarques_settings_general");
        do_settings_sections("page-marques");
        submit_button();
        ?>
    </form>
</div>