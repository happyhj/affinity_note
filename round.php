<?php

header('Access-Control-Allow-Origin:*');

$hostname = "localhost";
$username = "heejaekim";
$password = "eyes2012";
$dbname = "heejaekim";
$connect = mysqli_connect($hostname,$username,$password,$dbname, "3306") or die("MySQL Server 연결에 실패했습니다");

$method = $_POST["method"];


if($method == "createRound") {

	$roundTopic = $_POST["roundTopic"];
	$ideationTime = $_POST["ideationTime"];
	$managerEmail = $_POST["managerEmail"];
	$roundTopicDescription = $_POST["roundTopicDescription"];
	
    $addedtime = date('Y-m-d H:i:s', time(0));
    
	$addRoundQuery = "INSERT INTO round (managerEmail, topic, topicDescription, addedtime, status, ideationTime) VALUES (\"".$managerEmail."\", \"".$roundTopic."\", \"".$roundTopicDescription."\", \"".$addedtime."\",  \"beforeIdeation\", \"".$ideationTime."\")";	
	mysqli_query( $connect, $addRoundQuery );
	 
	$checkedUserList = $_POST["checkedUserList"];
	$checkedUserArray=explode(",",$checkedUserList); // 콤마 를 기준으로 문자를 구분해서 배열처리한다.

	for($i=0;$i<count($checkedUserArray);$i++){
		$addUserAndRoundQuery = "INSERT INTO user_round (userEmail, roundAddedTimestamp) VALUES (\"".$checkedUserArray[$i]."\", \"".$addedtime."\")";
		mysqli_query( $connect, $addUserAndRoundQuery );	
	}
	
	
} else if($method == "showUserList") {

	$currentUserEmail = $_POST["currentUserEmail"];

	$query = "SELECT * FROM user";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	$userStack = array();
	for($i=0;$i < $resultNum;$i++) {
		$row = mysqli_fetch_row($result);
		$email =$row[0];
		$lastname =$row[1];
		$firstname =$row[2];
		$aUser = array("email"=>$email, "lastname"=>$lastname, "firstname"=>$firstname);
		array_push($userStack, $aUser);
	}

	if($resultNum > 0) {
		echo json_encode($userStack);
	}
	
} else if($method == "showRoundList") {

	$currentUserEmail = $_POST["currentUserEmail"];

	$query = "SELECT * FROM user_round WHERE userEmail='".$currentUserEmail."'";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	$roundStack = array();
	for($i=0;$i < $resultNum;$i++) {
		$row = mysqli_fetch_row($result);
		$roundAddedTimestamp = $row[1];
		$roundInfoQuery = "SELECT * FROM round WHERE addedtime='".$roundAddedTimestamp."'";
		$roundInfoResult = mysqli_query( $connect, $roundInfoQuery );
		$roundInfoRow = mysqli_fetch_row($roundInfoResult);
		$aRound = array("managerEmail"=>$roundInfoRow[0], "topic"=>$roundInfoRow[1], "addedtime"=>$roundInfoRow[2], "status"=>$roundInfoRow[3], "ideationTime"=>$roundInfoRow[4],"topicDescription"=>$roundInfoRow[5]); 
		array_push($roundStack, $aRound);
	}

	if($resultNum > 0) {
		echo json_encode($roundStack);
	}
	
} else if($method == "showRoundParticipators") {

	$currentRoundId = $_POST["currentRoundId"];

	$query = "SELECT * FROM user_round WHERE roundAddedTimestamp='".$currentRoundId."'";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	$participatorStack = array();
	for($i=0;$i < $resultNum;$i++) {
		$row = mysqli_fetch_row($result);
		$aParticipator =$row[0];
		array_push($participatorStack, $aParticipator);
	}

	if($resultNum > 0) {
		echo json_encode($participatorStack);
	}
	
} else if($method == "submitIdeationStartTime") {

	$currentRoundId = $_POST["currentRoundId"];

	$query = "SELECT * FROM round WHERE addedtime='".$currentRoundId."'";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	$row = mysqli_fetch_row($result);
	if($row[6]==NULL){
	    $addedtime = date('Y-m-d H:i:s', time(0));
	    $addIdeationStartTimeQuery = "UPDATE round SET status=\"ideation\", ideationStartTime=\"".$addedtime."\" WHERE addedtime=\"".$currentRoundId."\"";
	    mysqli_query( $connect, $addIdeationStartTimeQuery );	
	}
	
} else if($method == "ideationFinish") {
	$currentRoundId = $_POST["currentRoundId"];
	$addIdeationStartTimeQuery = "UPDATE round SET status=\"close\" WHERE addedtime=\"".$currentRoundId."\"";
	mysqli_query( $connect, $addIdeationStartTimeQuery );	
	    
	$query = "SELECT * FROM round WHERE addedtime='".$currentRoundId."'";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	$row = mysqli_fetch_row($result);
	
	$ideationTime = $row[4];
	$ideationStartTime = $row[6];

	$Stack = array();
	
    $currentTime = date('Y-m-d H:i:s', time(0));
    $currentTimeTimestamp = strtotime($currentTime);
    $ideationStartTimeTimestamp =  strtotime($ideationStartTime);
    $timegap = $currentTimeTimestamp - $ideationStartTimeTimestamp;
    
	array_push($Stack, $ideationTime*1000);
	array_push($Stack, $timegap);

	echo json_encode($Stack);
	
} else if($method == "showNumberOfIdea") {
	$currentRoundId = $_POST["currentRoundId"];
	$query = "SELECT * FROM note WHERE roundId='".$currentRoundId."'";

	$result = mysqli_query( $connect, $query );
	$resultNum = mysqli_num_rows($result);

	echo $resultNum;
	
}

mysql_close($connect);

?>
