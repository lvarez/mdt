<?php /*

$local = false;

if($local){
    $hostname = 'localhost';
    $dbname = 'erp';
    $username = 'root';
    $password = '';
}else{
    $hostname = 'localhost';
    $dbname = 'db000031';
    $username = 'db000031';
    $password = 'rTsi83eF';
}

//echo $_SERVER['REQUEST_URI'] . '<br>';

//print_r($_GET);
// return;


// if(isset($_GET['id'])){
//     echo($_GET['id']);
//     return;
// }


if(!isset($_GET["keyword"])){

    $keyword = 're'; //htmlspecialchars($_GET["keyword"]);

    try{
        $connexion = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
        $connexion->exec("SET CHARACTER SET utf8");
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $resultats = $connexion->query("SELECT CONCAT(Socity, ' ', FirstName, ' ', LastName) AS Nom, street as Rue, CONCAT(zip, ' ', city) as Localité FROM contacts WHERE LastName LIKE '%" . $keyword . "%' OR Socity LIKE '%" . $keyword . "%'")->fetchAll(PDO::FETCH_CLASS);
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
        $resultats = $connexion->query("SELECT IF(Socity<>'', Socity, CONCAT(Lastname, ' ', firstname)) AS Nom, street as Rue, zip as NPA, city as Localité FROM contacts ORDER BY nom")->fetchAll(PDO::FETCH_CLASS);
        header('Content-Type: application/json; charset=UTF-8');
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        print json_encode($resultats);
    }catch(PDOException $e){
        die("<br>Erreur PDO : " . $e->getMessage());
    }catch(Exception $e){
        die("<br>Erreur : " . $e->getMessage());
    }

}
 */

$local = false;

if(isset($_GET["keyword"])){

    // $keyword = htmlspecialchars($_GET["keyword"]);

    // try{
    //     $connexion = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
    //     $connexion->exec("SET CHARACTER SET utf8");
    //     $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    //     $resultats = $connexion->query("SELECT IF(Socity<>'', Socity, CONCAT(Lastname, ' ', firstname)) AS Nom, street as Rue, zip as NPA, city as Localité FROM contacts ORDER BY nom WHERE nom LIKE '%" . $keyword . "%' OR raisonSociale LIKE '%" . $keyword . "%'")->fetchAll(PDO::FETCH_CLASS);
    //     header('Content-Type: application/json; charset=UTF-8');
    //     print json_encode($resultats);
    // }catch(PDOException $e){
    //     die("Erreur : " . $e->getMessage());
    // }catch(Exception $e){
    //     die("Erreur : " . $e->getMessage());
    // }

}else{
    try{
        $connexion = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
        $connexion->exec("SET CHARACTER SET utf8");
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $resultats = $connexion->query("SELECT id, CONCAT(nom, ' ', prenom) AS nom, CONCAT(adresse, ' ', numero) as adresse, npa, ville FROM contacts ORDER BY nom")->fetchAll(PDO::FETCH_CLASS);
        header('Content-Type: application/json; charset=UTF-8');
        print json_encode($resultats);
    }catch(PDOException $e){
        die("<br>Erreur PDO : " . $e->getMessage());
    }catch(Exception $e){
        die("<br>Erreur : " . $e->getMessage());
    }

}
 
?>
