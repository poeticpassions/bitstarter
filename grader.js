#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var sys = require ('util');
console.log ('restler lib: ' + rest );

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLFILE_DEFAULT = "index.html";


//google test
/*
rest.get('http://google.com').on('complete', function(result) {
  if (result instanceof Error) {
    sys.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    sys.puts(result);
  }
});

*/

/*
rest.get('http://rocky-everglades-4435.herokuapp.com').on('complete', function(result,data,response){
if (result instanceof Error) {
    sys.puts('Error: ' + response.message);
  //  this.retry(5000); // try again after 5 sec
  }
else {
    sys.puts(result);
  }

console.log ('data from rest: ' + data[0]);
console.log ('response: ' + response);
sys.puts('the result: ' + result);
sys.puts('the response: ' + response);
sys.puts('message: ' + data[0]); 
});
*/
//return false;
/*fs.stat('http://rocky-everglades-4435.herokuapp.com/', function (err,stats){

//if (err) throw err;
console.log ('stats: ' + JSON.stringify(stats));

});
*/
var assertFileExists = function(infile) {
    var instr = infile.toString();

    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);

        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlFileExists = function(infile){

var instr = infile.toString();

rest.get(infile).on('complete', function(result,data,response){

if (result instanceof Error) {
//    sys.puts('Error: ' + response.message);
  //  this.retry(5000); // try again after 5 sec

        console.log("%s does not exist. Exiting.", instr);

        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
  }
return instr;

console.log ('data from rest: ' + data[0]);
console.log ('response: ' + response);
sys.puts('the result: ' + result);
sys.puts('the response: ' + response);
sys.puts('message: ' + data[0]);


});




}

var cheerioUrlFile = function(urlFile){
	return cheerio.load(fs.readFileSync(urlFile));
};
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkUrlFile = function(urlfile, checksfile) {
    $ = cheerioUrlFile(urlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url_file>', 'Path to index.html', clone(assertUrlFileExists), URLFILE_DEFAULT)
        .parse(process.argv);
if (program.option('-u, --url <url_file>', 'Path to index.html','','')){
console.log ('url option');
}
program.option('-u, --url <url_file>', 'Path to index.html',console.log('option url'),'');
    var checkJson = checkHtmlFile(program.file, program.checks);
    var checkJson2 = checkUrlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
