

var app = angular.module('myApp',[]);

$( document ).ready(function() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	ctx.canvas.width  = window.innerWidth - (window.innerWidth/2);
	ctx.canvas.height = 400;
	fieldImage = new Image();
	fieldImage.src = 'Res/field.jpg';

	fieldImage.onload =function(){
		ctx.drawImage(fieldImage, 0,0, fieldImage.width , fieldImage.height,
								  0,0, ctx.canvas.width , ctx.canvas.height);
	}

	$("#myCanvas").click(function(e){
		console.log("called");
	    getPosition(e); 
	});

});


function getPosition(event){
	var canvas = document.getElementById("myCanvas");
	var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left; // x == the location of the click in the document - the location (relative to the left) of the canvas in the document
    var y = event.clientY - rect.top;
    console.log("x: "+x + " y : "+ y );
    drawCoordinates(x,y);
}

function drawCoordinates(x,y){
    var pointSize = 3; // Change according to the size of the point.
    var ctx = document.getElementById("myCanvas").getContext("2d");
    ctx.fillStyle = 'red'; // Red color

    ctx.beginPath(); //Start path
    ctx.arc(x, y, 3, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
    ctx.fill(); // Close the path and fill.
}


app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller('myCtl', function($scope, $http) {

	$scope.getReady = function(){
		console.log("Sending the request: ")
		$http.get("api/getData")        //Add parms to make it secure 
		.then(function (response) {
			$scope.dataPoints = response.data;

			//var obj = JSON.parse(response.data);
			console.log(JSON.stringify(response.data[1]));
			console.log(JSON.stringify(response.data));
		});
	};
	
});