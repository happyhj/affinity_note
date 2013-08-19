// JQM에서는 문서를 로드 시 모든 페이지를 초기화 하는 패턴을 사용한다. 
// 전체문서를 로드할때 최초 한번만 실행할 것과
// 페이지가 나타날때마다 실행할 초기화작업을 정의 한다.
(function($) {
	var methods = { 
		initLoginPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
			// 사용중이었던 사용자 정보가 있으면 그 정보를 이용해 바로 홈화면으로 이동
			loadAppStatus();

			var $page = $("#loginPage");
			$page.bind("pageshow", function(event, ui) {
				// 로그인 옵션페이지가 표시될때 이전에 로그인폼이나 가입폼에 입력했던 값들은 다 지워준다.
				
				// 로그인폼 입력 초기화
				$('#loginPage input[type="email"]').each(function(){
				  $(this).val("");  
				});
				$('#loginPage input[type="password"]').each(function(){
				  $(this).val("");  
				});
				

				// 가입폼 폼 입력 초기화 
				$('#signupPage input[type="text"]').each(function(){
				  $(this).val("");  
				});
				$('#signupPage input[type="email"]').each(function(){
				  $(this).val("");  
				});
				$('#signupPage  input[type="password"]').each(function(){
				  $(this).val("");  
				});				
			});	
		},		
		initSignupPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
			
			var $page = $("#signupPage");
			$page.bind("pageshow", function(event, ui) {
			});	
			$page.bind("pagehide", function(event, ui) {
			});	
		},

		initroundPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#roundPage");
			// 헤더에 로그인된 사용자 이름 표시
			$("#roundPage").children("header").children("h1").html(localStorage["currentUserFirstname"]+" "+localStorage["currentUserLastname"]);
			//콘텐츠 부분에 로그인된 사용자가 포함된 라운드를 표시해 준다.
			showRoundParticipating();

			$page.bind("pageshow", function(event, ui) {
				// 헤더에 로그인된 사용자 이름 표시
				$("#roundPage").children("header").children("h1").html(localStorage["currentUserFirstname"]+" "+localStorage["currentUserLastname"]);
				//콘텐츠 부분에 로그인된 사용자가 포함된 라운드를 표시해 준다.
				showRoundParticipating();
			});	
		},		
		
		initSelectUserPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#selectUserPage");

			$page.bind("pagebeforeshow", function(event, ui) {
			showUserList();
			});	
			$page.bind("pageshow", function(event, ui) {
				
			});	
		},			
		initBeforeIdeationPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#beforeIdeationPage");

			$page.bind("pagebeforeshow", function(event, ui) {
							// 선택 된 라운드의 정보를 표시
				var i;
				for(i=0;i<roundInfoJSON.length;i++) {	 
					if(localStorage.getItem("currentRoundId")==roundInfoJSON[i].addedtime) {
						$("#topicTitle").html(roundInfoJSON[i].topic);
						$("#ideationTime").html(roundInfoJSON[i].ideationTime);
						$("#topicDescription").html(roundInfoJSON[i].topicDescription);
					}
				}
				// 선택 된 라운드에 참여하는 사람들을 표시
				showRoundParticipators();
			});	
			$page.bind("pageshow", function(event, ui) {

			});	
		},		
		initIdeationPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#ideationPage");

			$page.bind("pagebeforeshow", function(event, ui) {
		
			});	
			$page.bind("pageshow", function(event, ui) {
			});	
		},		
		initResultPage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#resultPage");

			$page.bind("pagebeforeshow", function(event, ui) {
		
			});	
			$page.bind("pageshow", function(event, ui) {
			showNumberOfIdea();
			});	
		},	
		
		initAllNotePage : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
				
			var $page = $("#allNotePage");

			$page.bind("pagebeforeshow", function(event, ui) {
				showAllNoteForCurrentRound();
			});	
			$page.bind("pageshow", function(event, ui) {

			});	
		},		
						
		initAll : function(options) {
			var settings = {
				callback: function() {}
			};
			if ( options ) {
				$.extend( settings, options );
			}
			$().initApp("initLoginPage");
			$().initApp("initSignupPage");
			$().initApp("initroundPage");
			$().initApp("initSelectUserPage");
			$().initApp("initBeforeIdeationPage");
			$().initApp("initIdeationPage");
			$().initApp("initResultPage");
			$().initApp("initAllNotePage");
		}
	};
	  
		
	$.fn.initApp = function(method) {
		if ( methods[method] ) {
		  	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  	return methods.initAll.apply( this, arguments );
		} else {
		  	$.error( 'Method ' +  method + ' does not exist' );
		} 
	}
})(jQuery);

// 여기가 스크립트 실행의 시작이다 문서가 준비되면 여기부터 수행한다.
$(document).ready(function() {
	$().initApp();
});
