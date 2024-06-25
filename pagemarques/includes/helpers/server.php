<?php

function pagemarques_get_domain() {
    // Get the host from the server variable
    $host = $_SERVER["HTTP_HOST"];
    
    // Split the host by dots
    $parts = explode('.', $host);

    // Determine the number of parts
    $numParts = count($parts);

    // Handle cases with subdomains
    if ($numParts > 2) {
        // If it has more than two parts, return the last two parts as the main domain
        $mainDomain = $parts[$numParts - 2] . '.' . $parts[$numParts - 1];
    } else {
        // If it has only two parts, return it as is
        $mainDomain = $host;
    }

    return $mainDomain;
}



function pagemarques_get_api_server(){
    return "https://data.catalogues-pharmagency.fr/api";
}