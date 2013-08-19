<?php

header('Access-Control-Allow-Origin:*');

$hostname = "localhost";
$username = "heejaekim";
$password = "eyes2012";
$dbname = "heejaekim";
$connect = mysqli_connect($hostname,$username,$password,$dbname, "3306") or die("MySQL Server 연결에 실패했습니다");

$method = $_POST["method"];
$email = $_POST["email"];


if($method == "getUserInfo") {
	$query = "SELECT * FROM user WHERE email='".$email."'";
	$result = mysqli_query( $connect, $query );
	$row = mysqli_fetch_row($result);
	
	echo json_encode(array("email"=>$row[0],"lastname"=>$row[1],"firstname"=>$row[2],"password"=>$row[3]));
} 
mysql_close($connect);

?>
