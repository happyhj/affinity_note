var roundInfoJSON = new Object();

function createRound() {
	var url = "round.php";
	var roundTopic = $("#roundTopicInput").val();
	var roundTopicDescription = $("#roundTopicDescription").val();
	var ideationTime = $('input[name=sliderIdeationTime]').val();
	var managerEmail = localStorage.getItem("currentUserEmail");
	// 선택한 멤버의 이메일 주소를 배열로 생성 
	var checkedUserList = new Array();

	$("input[type=checkbox]:checked").each(function(){
		checkedUserList.push($(this).val()); 	
	});
	checkedUserList.push(managerEmail);
	
	//참여 멤버들 정보를 하나의 키값에 넣기
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "createRound" ,"roundTopic" : roundTopic , "roundTopicDescription" : roundTopicDescription, "ideationTime" : ideationTime , "managerEmail" : managerEmail , "checkedUserList" : checkedUserList.toString() },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			//라운드 페이지로 이동
			alert("라운드가 생성되었습니다.")
			$.mobile.changePage( '#roundPage', { transition: 'flip'} );
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("라운드 등록 AJAX 요청 실패");
			return false;
	    }
    });
  
};

function submitIdeationStartTime() {
	var currentRoundId = localStorage.getItem("currentRoundId");
	var url = "round.php";
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "submitIdeationStartTime" , "currentRoundId" : currentRoundId },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });	

}
function showUserList() {
	$("#userList").empty();

	var url = "round.php";
	var currentUserEmail = localStorage.getItem("currentUserEmail");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showUserList" , "currentUserEmail" : currentUserEmail },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행

		for(var i=0;i<data.length;i++) {
			if(data[i].email!=currentUserEmail) {
				$("#userList").append("<input type='checkbox' name='addUserCheckbox_"+data[i].email+"' id='addUserCheckbox_"+data[i].email+"' value='"+data[i].email+"' /><label for='addUserCheckbox_"+data[i].email+"'>"+data[i].firstname+" "+data[i].lastname+"</label>");
			}
		}

		$("#userList input[type='checkbox']").each(function(){
			  $(this).checkboxradio();
		});
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });
}

function showRoundParticipators() {
	$("#roundParticipators").empty();
	var currentRoundId = localStorage.getItem("currentRoundId");
	var url = "round.php";
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showRoundParticipators" , "currentRoundId" : currentRoundId },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			for(var i=0;i<data.length;i++) {
				$("#roundParticipators").append("<li>"+data[i]+"</li>");
			}
			$('#roundParticipators').listview('refresh');

			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });	
}
function showNumberOfIdea() {
	$("#resultPageContent").empty();
	var currentRoundId = localStorage.getItem("currentRoundId");
	var url = "round.php";
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showNumberOfIdea" , "currentRoundId" : currentRoundId },
	    dataType: 'text', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			$("#resultPageContent").append("<h1>We've generated</h1><h1>"+data+" IDEA!</h1>")
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });	
}
function ideationFinish() {
	// DB에서 현재 라운드의 ideationStartTime 과 아이데이션타임(초)불러온 후 
	var currentRoundId = localStorage.getItem("currentRoundId");
	var url = "round.php";
	var ideationTime;
	var timeGap;
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "ideationFinish" , "currentRoundId" : currentRoundId },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
	    	ideationTime = data[0];
	    	timeGap = data[1];
	// 현재시간과 비교하여 아이데이션 타임 이상의 차이가 날 경우
			if(timeGap*1000>(ideationTime)) {
				alert("아이데이션 시간이 완료되었습니다.\n결과 페이지로 이동합니다.");
				$.mobile.changePage( "#resultPage", { transition: "slideup" } );
			}
	// Result Page로 이동하는 Alert창을 띄운다.
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });	

	
}

function showRoundParticipating() {
	$("#roundPageContent").empty();

	var url = "round.php";
	var currentUserEmail = localStorage.getItem("currentUserEmail");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showRoundList" , "currentUserEmail" : currentUserEmail },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
		roundInfoJSON = data;
		for(var i=0;i<data.length;i++) {
			$("#roundPageContent").append("<li><a href=\"#beforeIdeationPage\" onclick=\"updateCurrentRoundId(\'"+data[i].addedtime+"\');\">"+data[i].topic+"</a></li>");
			
		}
		
		$('#roundPageContent').listview('refresh');
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("회원리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });	
}
function updateCurrentRoundId(currentRoundId) {
	localStorage["currentRoundId"] = currentRoundId;
}
 