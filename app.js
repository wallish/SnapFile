var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;
var bodyParser = require('body-parser');
var fs = require('fs');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/',
	changeDest: function(dest, req, res){
		var mkdirp = require("mkdirp");
		var folder = req.body.folder;
		return dest+folder;
	},
	/*rename: function (fieldname, filename, req, res) {
		return filename+Date.now();
	},*/
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
		done=true;
	}
}));
app.use(express.static('public'));


app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/list', function(req, res) {
	fs.readdir('./uploads',function(err, folders){
		if(err) 
		{
			throw err;
			return;
		}
		console.log(folders);		
		res.render('pages/list', {folders:folders})
	});
	
});

app.post('/file/upload',function(req,res){
	var folder = req.body.folder;
	if(done==true){
		console.log(req.files);
		//res.end("File uploaded.");
	}
});

app.post('/folder/add', function(req, res){
	var name = req.body.name;
	var creator = req.body.creator;
	var icon = req.body.icon;
});

app.get('/create/folder', function(req, res){
	res.render('pages/formFolder');
});

app.get('/:folder', function(req, res){
	var folder = req.params.folder;
	//res.render('pages/machin',{var:values});
});

app.get('/:folder/:file', function(req, res){
	var folder = req.params.folder
    , file = req.params.file;
    res.download('uploads/' + folder + '/' + file);
});

app.listen(8080);

console.log('8080 is the magic port');