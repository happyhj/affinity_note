function validateRegEx(regex, inputString) {		
// 정규식에 맞는게 옭은것.
	if(regex.test(inputString)==true ) { // inputStr 변수 데이터가 문제없는지 체크
		return true;// 데이터에 문제가 없다면 true를 반환.
		}
	else { // 정규표현식 불합격
		return false;
	}
}

function validateRegExComplement(regex, inputString) { 	
// 정규식에 맞는게 틀린것.
	if(regex.test(inputString)==false ) { // inputStr 변수 데이터가 문제없는지 체크
		return true;// 데이터에 문제가 없다면 도움말 메시지를 지우고 true를 반환.
		}
	else { // 정규표현식 합격
		return false;
	}
}

function validateFirstName() {
	var inputString = $("#signupFirstNameInput").val();
	var helpMessage;
	if(validateRegExComplement(/.+/,inputString)) { // 입력이 비어있는 경우
		helpMessage = "어피니티 노트에서\n친구들이 당신을 찾을 수 있게\n이름을 입력해 주세요.";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;
	} else {
		$("#signupPage").data("firstName",inputString);
		return true;
	}
}

function validateLastName() {
	var inputString = $("#signupLastNameInput").val();
	var helpMessage;
	if(validateRegExComplement(/.+/,inputString)) { // 입력이 비어있는 경우
		helpMessage = "어피니티 노트에서\n친구들이 당신을 찾을 수 있게\n성을 입력해 주세요.";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;
	} else {
		$("#signupPage").data("lastName",inputString);
		return true;
	}
}

function validateEmail() {
	var inputString = $("#signupEmailInput").val();
	var helpMessage;
	if(validateRegExComplement(/.+/,inputString)) { // 입력이 비어있는 경우
		helpMessage = "어피니티 노트 계정을 확인하고 로그인 할 수 있도록, 이메일 주소를 입력해 주세요.";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;
	} else if(validateRegExComplement(/^\w+\@\w+\.\w+$/,inputString)) {
		helpMessage = "어피니티 노트에 로그인하고 계정을 확인받기 위해서는, 정확한 이메일 주소를 적으셔야 합니다.";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;	
	} else {
		return true;
	}
}

function validatePassword() {
	var inputString = $("#signupPasswordInput").val();
	var helpMessage;
	if(validateRegExComplement(/.+/,inputString)) { // 입력이 비어있는 경우
		helpMessage = "암호 선택하기\n어피니티 노트를 안전하게 사용할 수 있도록, 암호를 신중히 입력해 주세요.";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;
	} else if(validateRegExComplement(/.{6,}/,inputString)) {
		helpMessage = "패스워드가 너무 짧습니다.\n어피니티 노트를 안전하게 사용할 수 있도록, 암호를 신중히 입력해 주세요.(6자 이상)";
		$("#signupPage").data("helpMessage",helpMessage);
		return false;	
	} else {
		return true;
	}
}

function confirmEmail() {
	var email = $("#signupEmailInput").val();
	var confirmEmail=confirm("이메일 주소가 올바른가요?\n"+email);
	if (confirmEmail==true) {
		return true;
	} else {
		return false;
	}
}

function checkEmailDuplicity() {
	var helpMessage;
	var emailDuplicity = true;
	var email = $("#signupEmailInput").val();
	//Ajax요청으로 중복된 이메일이 존재하는지 확인
	var url = "signup.php";
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "emailDuplicity" , "email" : email },
	    dataType: 'json', // 결과를 반환 받는 형식은 text 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
	        emailDuplicity = data.emailDuplicity;
	        var alertMessage = data.responseText;
	        if (emailDuplicity == "true") {
	        	alert(alertMessage);
				return false;
			} else { // 이메일이 중복되지않아 사용 가능 한 경우
				addANewAccountToDB();
				return true;
			}
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("이메일 중복요청 AJAX 요청 실패");
			return false;
	    }
    });
	

}
 
 ////////////////////////////////////가입정보를 DB에 넣기!!
function addANewAccountToDB() {
	var url = "signup.php";
	var firstName = $("#signupFirstNameInput").val();
	var lastName = $("#signupLastNameInput").val();
	var email = $("#signupEmailInput").val();
	var password = $("#signupPasswordInput").val();
		
	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "method" : "addAccount" , "firstName" : firstName , "lastName" : lastName, "email" : email , "password" : password },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			// 로컬 스토리지에 현재 사용자 이메일을 저장하고
			localStorage["currentUserEmail"] = email;
			alert("반갑습니다!\n어피니티 노트의 회원이 되신것을 축하드립니다.");
			// 메인 화면으로 이동한다.
			loadAppStatus();
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("계정등록 AJAX 요청 실패");
			return false;
	    }
    });
}

function validateAccount() {
	if (validateFirstName()) {
		if(validateLastName()) {
			if(validateEmail()) {
				if(validatePassword()) {
					if(confirmEmail()) {
						checkEmailDuplicity();
					} else {
						
					}
				} else {
					alert($("#signupPage").data("helpMessage"));
				}
			} else {
				alert($("#signupPage").data("helpMessage"));
			} 	
		} else {
			alert($("#signupPage").data("helpMessage"));
		}
	} else {
	alert($("#signupPage").data("helpMessage"));
	}
}

function signIn() {
	var loginEmailString = $("#loginEmailInput").val();
	var loginPasswordString = $("#loginPasswordInput").val();
	var url = "login.php";
	
	
	if(validateRegExComplement(/.+/,loginEmailString)) { // 입력이 비어있는 경우
		alert('이메일을 입력하세요.');
	} else if(validateRegExComplement(/.+/,loginPasswordString)) { // 입력이 비어있는 경우
		alert('암호를 입력하세요.');
	} else {

		$.ajax({
		    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
		    url: url, // 요청한 주소는 url 변수에 담겨 있다.
		    data: { "method" : "login" , "email" : loginEmailString , "password" : loginPasswordString },
		    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
		    success: function(data) { // 요청이 성공했을때 실행		        
		    	if(data.loginAccepted == "true") {
					// 로컬 스토리지에 현재 사용자 이메일을 저장하고
					localStorage["currentUserEmail"] = data.userEmail;
					// 메인 화면으로 이동한다.
					loadAppStatus();
				} else if(data.loginAccepted == "false") {
					alert("계정이상\n로그인 정보를 재확인 후 재시도 해주세요.");
				}
		    },
		    error: function() { // 요청이 실패했을때 실행
		        alert("로그인 계정확인 AJAX 요청 실패");
		    }
		});	
	}
}

function signOut() {
	localStorage.removeItem("currentUserEmail");
	localStorage.removeItem("currentUserFirstname");
	localStorage.removeItem("currentUserLastname");
	localStorage.removeItem("currentUserPassword");
 
	// 로그인 옵션 화면으로 이동한다.
	$.mobile.changePage( "#loginPage", { transition: "flip"} );
}

function loadAppStatus() {
	if(localStorage.getItem("currentUserEmail")) {
		getUserInformationFromServer();
	}
}

function getUserInformationFromServer() { // 현재 로그인 된 유저의 정보를 서버에서 불러와서 로컬 스토리지에 저장한다.
	var url = "userInfo.php";
	var email = localStorage.getItem("currentUserEmail");

	$.ajax({
	    type: 'POST', // Ajax 요청을 POST 방식으로 보낸다.
	    url: url, // 요청한 주소는 url 변수에 담겨 있다.
	    data: { "email" : email, "method" : "getUserInfo" },
	    dataType: 'json', // 결과를 반환 받는 형식은 json 형식이다.
	    success: function(data) { // 요청이 성공했을때 실행
			// 로컬 스토리지에 현재 사용자 정보를 저장
			localStorage["currentUserFirstname"] = data.firstname;
			localStorage["currentUserLastname"] = data.lastname;
			localStorage["currentUserPassword"] = data.password;
			$.mobile.changePage( "#roundPage", { transition: "flip"} );
			return true;
	    },
	    error: function() { // 요청이 실패했을때 실행
	        alert("유저정보 불러오는 AJAX 요청 실패");
			return false;
	    }
    });	
}