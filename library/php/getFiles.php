<?php

$filename = $_SERVER['DOCUMENT_ROOT'] . "/luis/public/json/player.json";

if(file_exists($filename)){

    echo file_get_contents($filename);

}else{
    
    require_once "getid3/getid3.php";

    $liste_rep  = scandir("../../public/sounds/mp3/player/");
    $result     = [];

    foreach($liste_rep as $value){
        if($value === '.' || $value === '..'){
            continue;
        }

        $getID3 = new getID3;
        $time = $getID3->analyze("../../public/sounds/mp3/player/" . $value)['playtime_string'];    
        array_push($result, array('title' => substr($getID3->info['filename'], 0, strlen($getID3->info['filename'])-4), 'value' => "public/sounds/mp3/player/" . $value, 'duration' => $time));
    }
    array_push($result, array('title' => 'Couleurs 3', 'value' => 'http://stream.srg-ssr.ch/m/couleur3/mp3_128'));
    array_push($result, array('title' => 'LFM', 'value' => 'http://lausannefm.ice.infomaniak.ch/lausannefm-high.mp3'));
    array_push($result, array('title' => 'NRJ', 'value' => 'http://cdn.nrjaudio.fm/audio1/ch/50001/mp3_128.mp3'));
    array_push($result, array('title' => 'OneFM', 'value' => 'http://onefm.ice.infomaniak.ch/onefm-high.mp3'));
    array_push($result, array('title' => 'RougeFM', 'value' => 'http://rougefm.ice.infomaniak.ch/rougefm-high.mp3'));
    $result = json_encode($result,JSON_UNESCAPED_SLASHES + JSON_PRETTY_PRINT);
    echo($result);
    file_put_contents($filename, $result);

}

?>