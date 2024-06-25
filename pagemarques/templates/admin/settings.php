<div class="pagemarques-admin-main-container">
    <div>
        <h1>Page marques</h1>
        <div>
            <h2>Shortcode</h2>
            <div class="code-container" id="code-container">
                <code id="codeSnippet">[pagemarques]</code>
                <span class="tooltip" id="tooltip">Copied!</span>
            </div>
        </div>
        <form method="post" action="options.php" id="pagemarques-options-form">
            <?php
            settings_fields("pagemarques_settings_general");
            do_settings_sections("page-marques");
            submit_button();
            ?>
        </form>
    </div>
    <div>
        <?php echo do_shortcode("[pagemarques]"); ?>
    </div>
</div>