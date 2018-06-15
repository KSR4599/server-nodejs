var autoplot = require('./autoplot.js');

function ds() {return (new Date()).toISOString() + " ";};

// Start with callback. Callback will be called when servlet
// has started.
//autoplot.start(function () {test()});

// Start with no callback. Calls to autoplot.plot will be placed in queue
// and execute after servlet starts.
autoplot.start();

if (1) {
	setInterval(function () {
		test();
	},1000);
}

function test() {
	var testurl = 'vap+dat:http://localhost:8999/autoplot_test.dat?depend0=field1&column=field0';
	autoplot.plot(testurl,processimage);
}

function processimage(err,png,info) {
	if (err) {
		console.log(ds() + err + "," + info.time);
	} else {
		console.log(ds() + png.length + "," + info.time);
	}
}

// Catch CTRL-C or exit signal
process.on('SIGINT', function () { process.exit(); });

// Handle CTRL-C or exit signal
// TODO: Should this code be in autoplot.js?
process.on('exit', function () {
	console.log(ds() + "Received exit signal.");
	autoplot.stop();
	console.log(ds() + "Exiting.");
});
