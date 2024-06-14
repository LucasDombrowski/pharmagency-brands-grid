<?php

require_once pagemarques_path("/includes/helpers/server.php");

function pagemarques_get_domain_data(string $domain){
    $data = pagemarques_get_request_data("/clients/domain/".$domain);
    if(isset($data->exception)){
        return [
            "exception"=>$data->exception
        ];
    } else  {
        $data->all_brands = pagemarques_get_all_client_brands($data->id);
        return $data;
    }
}

function pagemarques_get_request_data(string $request){
    return json_decode(
        wp_remote_retrieve_body(
            wp_remote_get(
                pagemarques_get_api_server().$request
            )
        )
    );
}

function pagemarques_get_all_client_brands(int $id){
    return pagemarques_get_request_data("/clients/$id/brands");
}

