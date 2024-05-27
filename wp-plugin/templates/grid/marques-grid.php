<div class="pagemarques_grid_container" style="grid-template-columns: repeat(<?=$params["columns"]?>,1fr);">
    <?php
    foreach($data->all_brands as $brand): ?>
        <div>
            <img class="pagemarques_grid_item_image" src="<?=isset($brand->png_url) ? $brand->png_url : $brand->jpg_url?>" alt="<?=$brand->name?>"/>
        </div>
    <?php 
    endforeach;
    ?>
</div>