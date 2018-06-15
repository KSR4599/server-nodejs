var spawn = require('child_process').spawn
var spawnSync = require('child_process').spawnSync;
var execSync = require('child_process').execSync;

var request = require('request');
var requestSync = require('sync-request');

//options = {"cwd": "../autoplot/"}
options = {"cwd": "."}

// Date string for logging.
function ds() {return (new Date()).toISOString() + " ";};

var PORT = 8001;
// TODO: Use a module to allow port to be set using
// const ap = require('./autoplot.js');
// ap = new Autoplot(PORT);
// ap.start();
// ap.stop();
// https://nodejs.org/api/modules.html

var baseurl = "http://localhost:" + PORT + "/AutoplotServlet";

test = function (cb) {
	// See if servlet running by checking landing page.
	request
		.get(baseurl, function(error, response, body) {
			if (error) {
				// Servlet not running. Start it.
				start(cb);
			} else {
				// Servlet running.
				cb();
			}
		})	
}

plot = function (url,cb) {

	if (typeof(start.starting) !== 'undefined') {
		if (start.starting) {
			console.log(ds() + "Autoplot is starting. Queuing plot request.");
			start.cbqueue.push(function () {plot(url,cb);});
			return;		
		}
	}
	var info = {"url":"","time":-1};
	const tic = new Date().getTime();
	var urls = baseurl + "/SimpleServlet?url="+encodeURIComponent(url);
	request
		.get(urls, function(error, response, body) {
			var toc = new Date().getTime();					
			info.time = toc-tic;
			if (error) {
				// See if issue is stopped servlet. If yes,
				// start it and try plot command again.
				// TODO: Not tested.
				console.log(ds() + "Servlet not running. Starting and trying again.");
				test(function () {plot(url,cb)}); 
			} else {
				if (response.statusCode == 200 && response.headers['content-type'] === 'image/png') {
					cb(null,body,info);
				} else {
					// TODO: Handle this error.
					cb(response.statusCode,null,info);
				}
			}
		})	
}
exports.plot = plot;

restart = function () {
	stop();
	start();
}
exports.restart = restart;

start = function (cb) {

	start.starting = true;

	if (typeof(start.cbqueue) === 'undefined') {
		start.cbqueue = [];
	}
	if (typeof(cb) === 'function') {
		start.cbqueue.push(cb);
	}

	console.log(ds() + "Starting Autoplot at");
	console.log(ds() + "   " + baseurl);
	// Nothing gets executed after this.
	// Is this because make spawns another process?
	autoplot = spawn('make',['-s','start','PORT='+PORT],options);

	autoplot.kill = function () {
		stop();
	}
	autoplot.stdout.on('data', function (data) {
		console.log(ds() + "autoplot stdout: " + data.toString().replace(/\n$/,""));
	})
	autoplot.stderr.on('data', function (data) {
		console.log(ds() + "autoplot stderr: " + data.toString().replace(/\n$/,""));
	})
	autoplot.on('close', function (code) {
		console.log(ds() + "make command closed with code: " + code)
	})	
	autoplot.on('exit', function (code) {
		console.log(ds() + "Autoplot running");
		start.starting = false;
		while (start.cbqueue.length > 0) {
			(start.cbqueue.pop())();
		}
	})	

	//console.log(str.stdout.toString());
	//console.log(str); // Not executed
}
exports.start = start;

stop = function () {
	console.log(ds() + "Stopping Autoplot server.");

	str = spawnSync('make',['-s','stop'], options);

	if (str) {
		if (str.stdout.toString() !== "")
			console.log(ds() + "Autoplot stdout: "
							 + str.stdout.toString().replace(/\n$/,""));
		if (str.stderr.toString() !== "") {
			console.log(str.stderr.length);
			console.log(ds() + "Autoplot stderr: " + str.stderr);
		}
	}
}
exports.stop = stop;

/*
// TODO: Consider async start/stop.
// Async spawn
start = function (cb) {
	autoplot = spawn('make',['start'],options);
	autoplot.stdout.on('data', function (data) {
		if (data) {
			if (data.toString().match("Already Running")) {
				console.log(ds() + "Autoplot is already running.");
			}
		}
	})
	autoplot.stderr.on('data', function (data) {
		console.log(ds() + "Autoplot stderr: " + data);
	})
	autoplot.on('close', function (code) {
		console.log(ds() + "Autoplot exited with code: " + code);
	});
	cb();
}
*/

if (0) {
request
	.get(url)
	.on('response', function(response) {
		//console.log(response.statusCode) // 200
		//console.log(response.headers['content-type']) // 'image/png'
		if (response.statusCode == 200 && response.headers['content-type'] === 'image/png') {
			console.log(ds() + "Autoplot is already running at");
			console.log(ds() + "   " + "http://localhost:" + PORT);
		} else {
			start();
		}
	})	
	.on('error', function(err) {
		console.log(err);
		start();
	})
}
