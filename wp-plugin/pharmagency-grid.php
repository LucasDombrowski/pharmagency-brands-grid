<?php 
/*
Plugin Name: Pharmagency Grid
*/

function registerStyles(){
    wp_enqueue_style("pharmagency-grid-style",plugins_url("style.css",__FILE__));
}

function useApi(int $id){
    $url = "http://localhost:8000/api";
    $data = json_decode(wp_remote_retrieve_body(wp_remote_get($url."/clients/".$id)));
    $res = [];
    foreach($data->categories as $category){
        foreach($category->brands as $brand){
            $res[] = $brand;
        }
    }

    return array_map(function($v){
        return [
            "name"=>$v->name,
            "png_url"=>$v->png_url,
            "jpg_url"=>$v->jpg_url
        ];
    },$res);


}

function display(array $data, int $cols, string $containerClass, string $imageContainerClass, string $imageClass){
    $res = "<div class='pharmagency-brand-grid-container ".$containerClass."' style='grid-template-columns: repeat(".$cols.",1fr)'>";
    foreach($data as $image){
        $res = $res."<div class='pharmagency-brand-grid-image-container ".$imageContainerClass."'><img class='pharmagency-brand-grid-image ".$imageClass."' src='".$image["png_url"]."' alt='".$image["name"]."'/></div>";
    }
    $res = $res."</div>";
    return $res;
}

function registerShortCode(){
    add_shortcode("brandsgrid",function($attr){
        $attr = shortcode_atts([
            "id"=>1,
            "cols"=>3,
            "container-class"=>"",
            "image-container-class"=>"",
            "image-class"=>""
        ],$attr,"brandsgrid");
        $data =  useApi($attr["id"]);
        return display($data, $attr["cols"], $attr["container-class"], $attr["image-container-class"], $attr["image-class"]);
    });
}



add_action("init", "registerStyles");
add_action("init","registerShortCode");
?>