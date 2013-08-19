<?php

header('Access-Control-Allow-Origin:*');

$hostname = "localhost";
$username = "heejaekim";
$password = "eyes2012";
$dbname = "heejaekim";
$connect = mysqli_connect($hostname,$username,$password,$dbname, "3306") or die("MySQL Server 연결에 실패했습니다");

$method = $_POST["method"];
$email = $_POST["email"];


if($method == "emailDuplicity") {
	$query = "SELECT * FROM user WHERE email='".$email."'";
	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);
	
	if($resultNum > 0) {
		echo json_encode(array("emailDuplicity"=>"true", "responseText"=>"이메일 \"".$email."\"은 이미 사용 중 입니다."));
	} else {
		echo json_encode(array("emailDuplicity"=>"false", "responseText"=>"이메일 \"".$email."\"은 사용가능합니다."));
	}
} else if($method == "addAccount") {
	$firstName = $_POST["firstName"];
	$lastName = $_POST["lastName"];
	$password = $_POST["password"];

	$query = "INSERT INTO user (email, lastname, firstname, password) VALUES (\"".$email."\", \"".$lastName."\", \"".$firstName."\",  \"".$password."\")";
	mysqli_query( $connect, $query );
	
}

mysql_close($connect);

?>
