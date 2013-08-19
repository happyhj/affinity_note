<?php

header('Access-Control-Allow-Origin:*');

$hostname = "localhost";
$username = "heejaekim";
$password = "eyes2012";
$dbname = "heejaekim";
$connect = mysqli_connect($hostname,$username,$password,$dbname, "3306") or die("MySQL Server 연결에 실패했습니다");

$method = $_POST["method"];
$authorEmail = $_POST["authorEmail"];


if($method == "addNote") {
	$tag1 = $_POST["tag1"];
	$tag2 = $_POST["tag2"];
	$description = $_POST["description"];
	$doodleString = $_POST["doodleString"];
	$description = $_POST["description"];
	$currentRoundId = $_POST["currentRoundId"];

	$postedtime = date('Y-m-d H:i:s', time(0));
	$query = "INSERT INTO note (authorEmail, postedTime, tag1, tag2, doodleString, description, roundId) VALUES (\"".$authorEmail."\", \"".$postedtime."\", \"".$tag1."\",  \"".$tag2."\",  \"".$doodleString."\",  \"".$description."\",  \"".$currentRoundId."\")";
	mysqli_query( $connect, $query );
} else if($method == "showAllNoteForCurrentRound") {

	$currentRoundId = $_POST["currentRoundId"];

	$query = "SELECT * FROM note WHERE roundId='".$currentRoundId."'";
	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);
	
	$noteStack = array();
	for($i=0;$i<$resultNum;$i++) {
		$row = mysqli_fetch_row($result);
		$aNote = array("noteId"=>$row[0], "authorEmail"=>$row[1], "postedTime"=>$row[2], "tag1"=>$row[3], "tag2"=>$row[4],"doodleString"=>$row[5],"delay"=>$row[6],"description"=>$row[7],"roundId"=>$row[8]);
		array_push($noteStack, $aNote);
	}
	
	echo json_encode($noteStack);

} else if($method == "showMoreNote") {

	$currentRoundId = $_POST["currentRoundId"];
	$lastNotePostedTime = $_POST["lastNotePostedTime"];
	
	$query = "SELECT * FROM note WHERE roundId='".$currentRoundId."' AND postedTime>'".$lastNotePostedTime."'";
	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);
	
	$noteStack = array();
	for($i=0;$i<$resultNum;$i++) {
		$row = mysqli_fetch_row($result);
		$aNote = array("noteId"=>$row[0], "authorEmail"=>$row[1], "postedTime"=>$row[2], "tag1"=>$row[3], "tag2"=>$row[4],"doodleString"=>$row[5],"delay"=>$row[6],"description"=>$row[7],"roundId"=>$row[8]);
		array_push($noteStack, $aNote);
	}
	
	echo json_encode($noteStack);
} else if($method == "showWhiteboardTitle") {

	$currentRoundId = $_POST["currentRoundId"];
	
	$query = "SELECT * FROM round WHERE addedtime='".$currentRoundId."'";
	$result = mysqli_query( $connect, $query );
	
	$row = mysqli_fetch_row($result);
		
	echo $row[1];
} 
mysql_close($connect);

?>
