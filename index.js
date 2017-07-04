var express   = require('express');
var config  = require('./config');
var http      = require('http');
var util      = require('util');
var path = require('path');
var Excel = require('exceljs');
var async = require('async');

var colors  = require('colors');
console.log(('Server time: ').yellow, (new Date()).toString());
require('log-timestamp')(function() { return '[' + new Date() + '] %s' });

let app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));



var uniqueList = new Map();

var convertData = function(){
	// read from a file
	var workbook = new Excel.Workbook();
	workbook.xlsx.readFile('dataGame.xlsx')
	    .then(function() {
	        var worksheet = workbook.getWorksheet(1);

	        // Access an individual columns by key, letter and 1-based column number
			var playerCol = worksheet.getColumn('I');
			var action = worksheet.getColumn('M');
			var result = worksheet.getColumn('Q');
			var time = worksheet.getColumn('F');
			var locX = worksheet.getColumn('O');
			var locY = worksheet.getColumn('P');
			
			//make a list with the unique player names
			var makeUniquePlayers = function(){
				console.log("Called makeUniquePlayers");
				playerCol.eachCell({ includeEmpty: false }, function(cell, rowNumber) {
					var name = JSON.stringify(cell.value);
					if( !uniqueList.has(name) ) { uniqueList.set(name,null); }
				});
				console.log("MakeUnique endsss!");
			};

			var makeObj = function(){
				console.log("Called MakeObj:");
				var timeObj = {};
				for (var key of uniqueList.keys()) {
					//make a object 
					playerCol.eachCell({includeEmpty: false},function(cell,rowNumber){
						if (JSON.stringify(cell.value) == key){
							timeObj[worksheet.getCell('F'+rowNumber).value] = {'xloc': worksheet.getCell('O'+rowNumber).value ,'yloc':worksheet.getCell('P'+rowNumber).value };
						}
					});
					if (timeObj){
						uniqueList.set(key,timeObj);
					}
				}
				console.log("done");
			};

			makeObj(makeUniquePlayers());

	    });
}

setTimeout(function(){convertData();},2*1000);

app.get('/getData',function(req,res){
	res.status(200).send(JSON.stringify(uniqueList));
});

app.get('*', function(req, res) {
    res.status(200).sendFile(path.resolve('public/index.html'));
});

let port = process.env.VCAP_APP_PORT || config.get('port');

console.log("Listening port: " + port);
let server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});