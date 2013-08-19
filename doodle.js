$(document).ready(function(){
	$("#addDoodleButton").click(function(){
		$("#doodlePopup").popup("open");
	});
	
	$("#attachDoodleString").click(function(){
		var canvas  = document.getElementById("sketchCanvas");
		var dataUrl = canvas.toDataURL();
		clearDoodle();
		$("#doodleStringInput").val(dataUrl);
		$("#doodlePopup").popup("close");
		$("#previewDoodle").append("<img src='"+dataUrl+"'/>");

	});	
});

function attachDoodle() {
		var canvas  = document.getElementById("sketchCanvas");
		var dataUrl = canvas.toDataURL();
		$("#previewDoodle").empty();
		$("#doodleStringInput").val(dataUrl);
		$("#doodlePopup").popup("close");
		$("#previewDoodle").append("<img src='"+dataUrl+"'/>");
}

function clearDoodle() {
		var canvas  = document.getElementById("sketchCanvas");
	// context
    var ctx = canvas.getContext("2d");
    // 픽셀 정리
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
	$("#doodleStringInput").val("");
	$("#previewDoodle").empty();
	$("#doodlePopup").popup("close");
};

// When the window has loaded, scroll to the top of the
// visible document.
jQuery( window ).load(
function(){
 
// When scrolling the document, using a timeout to
// create a slight delay seems to be necessary.
// NOTE: For the iPhone, the window has a native
// method, scrollTo().
setTimeout(
function(){
window.scrollTo( 0, 0 );
},
50
);
 
}
);
 
 
// When The DOM loads, initialize the scripts.
jQuery(function( $ ){
 
// Get a refernce to the canvase.
var canvas = $( "canvas" );
 
// Get a reference to our form.
var form = $( "form" );
 
// Get a reference to our form commands input; this
// is where we will need to save each command.
var commands = form.find( "input[ name = 'commands' ]" );
 
// Get a reference to the export link.
var exportGraphic = $( "a" );
 
// Get the rendering context for the canvas (curently,
// 2D is the only one available). We will use this
// rendering context to perform the actually drawing.
var pen = canvas[ 0 ].getContext( "2d" );
 
// Create a variable to hold the last point of contact
// for the pen (so that we can draw FROM-TO lines).
var lastPenPoint = null;
 
// This is a flag to determine if we using an iPhone.
// If not, we want to use the mouse commands, not the
// the touch commands.
var isIPhone = (new RegExp( "iPhone", "i" )).test(
navigator.userAgent
);
 
 
// ---------------------------------------------- //
// ---------------------------------------------- //
 
 
// Create a utility function that simply adds the given
// command to the form input.
var addCommand = function( command ){
// Append the command as a list item.
commands.val( commands.val() + ";" + command );
};
 
 
// I take the event X,Y and translate it into a local
// coordinate system for the canvas.
var getCanvasLocalCoordinates = function( pageX, pageY ){
// Get the position of the canvas.
var position = canvas.offset();
 
// Translate the X/Y to the canvas element.
return({
x: (pageX - position.left),
y: (pageY - position.top)
});
};
 
 
// I get appropriate event object based on the client
// environment.
var getTouchEvent = function( event ){
// Check to see if we are in the iPhont. If so,
// grab the native touch event. By its nature,
// the iPhone tracks multiple touch points; but,
// to keep this demo simple, just grab the first
// available touch event.
return(
isIPhone ?
window.event.targetTouches[ 0 ] :
event
);
};
 
 
// I handle the touch start event. With this event,
// we will be starting a new line.
var onTouchStart = function( event ){
// Get the native touch event.
var touch = getTouchEvent( event );
 
// Get the local position of the touch event
// (taking into account scrolling and offset).
var localPosition = getCanvasLocalCoordinates(
touch.pageX,
touch.pageY
);
 
// Store the last pen point based on touch.
lastPenPoint = {
x: localPosition.x,
y: localPosition.y
};
 
// Since we are starting a new line, let's move
// the pen to the new point and beign a path.
pen.beginPath();
pen.moveTo( lastPenPoint.x, lastPenPoint.y );
 
// Add the command to the form for server-side
// image rendering.
addCommand(
"start:" +
(lastPenPoint.x + "," + lastPenPoint.y)
);
 
// Now that we have initiated a line, we need to
// bind the touch/mouse event listeners.
canvas.bind(
(isIPhone ? "touchmove" : "mousemove"),
onTouchMove
);
 
// Bind the touch/mouse end events so we know
// when to end the line.
canvas.bind(
(isIPhone ? "touchend" : "mouseup"),
onTouchEnd
);
};
 
 
// I handle the touch move event. With this event, we
// will be drawing a line from the previous point to
// the current point.
var onTouchMove = function( event ){
// Get the native touch event.
var touch = getTouchEvent( event );
 
// Get the local position of the touch event
// (taking into account scrolling and offset).
var localPosition = getCanvasLocalCoordinates(
touch.pageX,
touch.pageY
);
 
// Store the last pen point based on touch.
lastPenPoint = {
x: localPosition.x,
y: localPosition.y
};
 
// Draw a line from the last pen point to the
// current touch point.
pen.lineTo( lastPenPoint.x, lastPenPoint.y );
 
// Render the line.
pen.stroke();
 
// Add the command to the form for server-side
// image rendering.
addCommand(
"lineTo:" +
(lastPenPoint.x + "," + lastPenPoint.y)
);
};
 
 
// I handle the touch end event. Here, we are basically
// just unbinding the move event listeners.
var onTouchEnd = function( event ){
// Unbind event listeners.
canvas.unbind(
(isIPhone ? "touchmove" : "mousemove")
);
 
// Unbind event listeners.
canvas.unbind(
(isIPhone ? "touchend" : "mouseup")
);
};
 
 
// ---------------------------------------------- //
// ---------------------------------------------- //
 
 
// Bind the export link to simply submit the form.
exportGraphic.click(
function( event ){
// Prevent the default behavior.
event.preventDefault();
 
// Submit the form.
form.submit();
}
);
 
 
// Bind the touch start event to the canvas. With
// this event, we will be starting a new line. The
// touch event is NOT part of the jQuery event object.
// We have to get the Touch even from the native
// window object.
canvas.bind(
(isIPhone ? "touchstart" : "mousedown"),
function( event ){
// Pass this event off to the primary event
// handler.
onTouchStart( event );
 
// Return FALSE to prevent the default behavior
// of the touch event (scroll / gesture) since
// we only want this to perform a drawing
// operation on the canvas.
return( false );
}
);
 
});