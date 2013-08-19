function submitNote() {
	// 필수 입력 폼이 입력되었는지 확인
	var tag1Input = $("#tag1Input").val();
	var tag2Input = $("#tag2Input").val();
	var noteDescriptionInput = $("#noteDescriptionInput").val();
	var doodleStringInput = $("#doodleStringInput").val();
	
	if((tag1Input!="")&&(tag2Input!="")) {
		if(noteDescriptionInput!="") {
			// 현재 라운드 키값
			var currentRoundId = localStorage["currentRoundId"];
			var currentUserEmail = localStorage["currentUserEmail"];
			var url = "note.php";
			// 폼의 모든값을 AJAX로 DB에 인서트
		
			$.ajax({
			    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
			    url: url, // 요청한 주소는 url 변수에 담겨 있다.
			    data: { "method" : "addNote" , "tag1" : tag1Input , "tag2" : tag2Input, "description" : noteDescriptionInput , "doodleString" : doodleStringInput , "authorEmail" : currentUserEmail , "currentRoundId" : currentRoundId},
			    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
			    success: function(data) { // 요청이 성공했을때 실행
			    	// 콜백 : 폼에 입력된 모든 값을 지우고(초기화) 비어이쓴 노트폼 페이지로 전환. 셀프 트랜지션
			    	$("#tag1Input").val("");
			    	$("#tag2Input").val("");
			    	$("#noteDescriptionInput").val("");
			    	$("#doodleStringInput").val("");
			    	clearDoodle();
			    	alert("노트를 전송하였습니다.");
					return true;
			    },
			    error: function() { // 요청이 실패했을때 실행
			        alert("노트등록 AJAX 요청 실패");
					return false;
			    }
		    });
		} else {
			alert("자세한 설명도 필수 입니다^^*");
		}
    } else {
	    alert("두 단어 요약태그는 필수 입니다.");
    }	
}

var currentAllNoteJson = new Array();

function showAllNoteForCurrentRound() {
	$("#allNotePageContent").empty();

	var url = "note.php";
	var currentRoundId = localStorage.getItem("currentRoundId");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showAllNoteForCurrentRound" , "currentRoundId" : currentRoundId },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
	    	currentAllNoteJson = data;
			for(var i=0;i<data.length;i++) {
				$("#allNotePageContent").append("<a href='#noteDetailPopup' data-role='button' data-rel='popup' data-transition='pop' onclick='showDetailNoteInfo("+data[i].noteId+");'data-position-to='window'>"+data[i].tag1+" "+data[i].tag2+"</a>");
			}									

			$("#allNotePageContent a").each(function(){
				$(this).button(); 	
			});
						
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("전체 노트 리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });		
}

function showDetailNoteInfo(noteId) {
	$("#noteDetailPopup").empty();	
	$("#noteDetailPopup").append("<a href='#' data-rel='back' data-role='button' data-theme='a' data-icon='delete' data-iconpos='notext' class='ui-btn-right'>Close</a>");
	var i;
	for(i=0;;i++){
		if(currentAllNoteJson[i].noteId == noteId)
			break;
	}
			$("#noteDetailPopup").append("<h1>"+currentAllNoteJson[i].tag1+"<br/>"+currentAllNoteJson[i].tag2+"</h1>");
			if(currentAllNoteJson[i].doodleString) {
				$("#noteDetailPopup").append("<img src='"+currentAllNoteJson[i].doodleString+"' />");
			}
			$("#noteDetailPopup").append("<p>"+currentAllNoteJson[i].description+"</p>");
			$("#noteDetailPopup").append("<p>"+currentAllNoteJson[i].authorEmail+"</p>");
	
}

function showAllNoteForCurrentRoundDesktop() {
	$("#container").empty();

	var url = "note.php";
	var currentRoundId = localStorage.getItem("currentRoundId");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showAllNoteForCurrentRound" , "currentRoundId" : currentRoundId },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			for(var i=0;i<data.length-1;i++) {
				if(data[i].doodleString) {
					var $newItems = $("<div class='item'><br/></div>");
				} else {
					var $newItems = $("<div class='item'><br/></div>");
				}
				$newItems.append("<h1>"+data[i].tag1+"<br/>"+data[i].tag2+"</h1>");
				if(data[i].doodleString) {
					$newItems.append("<img src='"+data[i].doodleString+"' style='height:100px;margin-top:-30px;' />");
				}
				$newItems.append("<p>"+data[i].description+"</p>");
				$newItems.append("<p>"+data[i].authorEmail+"</p>");	
				$("#container").append($newItems);
			}
			//마지막 노트가 붙여진 시각 업데이트
//			if((data.length-2)>=0) {
				localStorage["lastNotePostedTime"] = data[data.length-2].postedTime;
//			}
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("전체 노트 리스트 호출 AJAX 요청 실패");
			return false;
	    }
    });		
}


function showMoreNote() {
	var url = "note.php";
	var currentRoundId = localStorage.getItem("currentRoundId");
	var lastNotePostedTime = localStorage.getItem("lastNotePostedTime");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showMoreNote" , "currentRoundId" : currentRoundId ,"lastNotePostedTime" : lastNotePostedTime},
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			for(var i=0;i<data.length;i++) {
				var $newItems = $("<div class='item'><br/></div>");
				$newItems.append("<h1>"+data[i].tag1+"<br/>"+data[i].tag2+"</h1>");
				if(data[i].doodleString) {
					$newItems.append("<img src='"+data[i].doodleString+"' style='height:100px;margin-top:-30px;'/>");
				}
				$newItems.append("<p>"+data[i].description+"</p>");
				$newItems.append("<p>"+data[i].authorEmail+"</p>");	
				$('#container').prepend( $newItems).isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });
			}
			//마지막 노트가 붙여진 시각 업데이트
			if((data.length-1)>=0) {
				localStorage["lastNotePostedTime"] = data[(data.length-1)].postedTime;
			}
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
			return false;
	    }
    });		
}

function showWhiteboardTitle() {
	$("#roundTitle").empty();

	var url = "note.php";
	var currentRoundId = localStorage.getItem("currentRoundId");
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "showWhiteboardTitle" , "currentRoundId" : currentRoundId },
	    dataType: 'text', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			$("#roundTitle").html(data);	
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("AJAX 요청 실패");
			return false;
	    }
    });		
}