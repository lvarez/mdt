<?php

error_reporting(E_ALL);

if(!isset($_POST)){
    header('Location:index.php'); 
}else{
    header('Content-Type: application/json; charset=UTF-8');
}

$header = 'From:' . $_POST['email'] . "\r\n" .
          'Reply-To:info@microdowntown.com' . "\r\n".
          '^X-Mailer: PHP/' . phpversion();

if(@mail("info@microdowntown.com", $_POST['subject'], $_POST['message'], $header)){
    $data = [
        'success' => true,
        'error' => '',
        'message' => "Le mail à été envoyer !"
    ];
}else{
    $data = [
        'success' => false,
        'error' => error_get_last(),
        'message' => "Le mail n'à pas été envoyer !"
    ];    
}

echo json_encode($data);