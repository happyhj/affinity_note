<?php

header('Access-Control-Allow-Origin:*');

$hostname = "localhost";
$username = "heejaekim";
$password = "eyes2012";
$dbname = "heejaekim";
$connect = mysqli_connect($hostname,$username,$password,$dbname, "3306") or die("MySQL Server 연결에 실패했습니다");

$method = $_POST["method"];
$email = $_POST["email"];
$password = $_POST["password"];

if($method == "login") {
	$query = "SELECT * FROM user WHERE email='".$email."' AND password='".$password."'";
	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);
	
	if($resultNum > 0) { // 로그인 정보가 일치할 때
		echo json_encode(array("loginAccepted"=>"true", "userEmail"=>$email));
	} else {	// 로그인 정보가 일치하지 않을 때 
		echo json_encode(array("loginAccepted"=>"false", "userEmail"=>$email));
	}
}

mysql_close($connect);

?>
