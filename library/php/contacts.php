<?php

$local = false;

if($_SERVER['HTTP_HOST'] === 'localhost'){
    $hostname = 'localhost';
    $dbname = 'erp';
    $username = 'root';
    $password = '';
}else{
    $hostname = 'localhost';
    $dbname = 'db000031';
    $username = 'db000031';
    $password = 'Nz1v8i21~';
}

if(isset($_GET["keyword"])){

    $keyword = htmlspecialchars($_GET["keyword"]);

    try{
        $connexion = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
        $connexion->exec("SET CHARACTER SET utf8");
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $resultats = $connexion->query("SELECT id, CONCAT(nom, raisonSociale) AS Nom FROM contacts WHERE nom LIKE '%" . $keyword . "%' OR raisonSociale LIKE '%" . $keyword . "%'")->fetchAll(PDO::FETCH_CLASS);
        header('Content-Type: application/json; charset=UTF-8');
        print json_encode($resultats);
    }catch(PDOException $e){
        die("Erreur : " . $e->getMessage());
    }catch(Exception $e){
        die("Erreur : " . $e->getMessage());
    }

}else{
    try{
        $connexion = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
        $connexion->exec("SET CHARACTER SET utf8");
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $resultats = $connexion->query("SELECT id, CONCAT_WS(' ', nom, raisonSociale) AS nom, adresse, npa, ville FROM contacts ORDER BY id")->fetchAll(PDO::FETCH_CLASS);
        header('Content-Type: application/json; charset=UTF-8');
        //sleep(10);
        print json_encode($resultats);
    }catch(PDOException $e){
        die("<br>Erreur PDO : " . $e->getMessage());
    }catch(Exception $e){
        die("<br>Erreur : " . $e->getMessage());
    }

}

?>