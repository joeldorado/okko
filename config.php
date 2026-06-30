<?php
header('Content-Type: application/json');

// Cargar variables del .env (solo si usas librería dotenv)
$env = parse_ini_file(__DIR__ . '/.env'); // Ajusta ruta según tu estructura
if(!isset($_POST['accessKey'])){ 
    echo json_encode(['status','missing parameters']);
    return;}
if($_POST['accessKey'] ==$env["OKKO_ACCESS_KEY_ID"]){
    echo json_encode(['status'=>'success']);
}else{
    echo json_encode(['status'=>'error']);
}


