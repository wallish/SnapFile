var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(multer({ dest: './uploads/',
	rename: function (fieldname, filename) {
		return filename+Date.now();
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
		done=true;
	}
}));



// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.post('file/upload',function(req,res){
	if(done==true){
		console.log(req.files);
		res.end("File uploaded.");
	}
});


app.listen(8080);

console.log('8080 is the magic port');