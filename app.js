var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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


app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/list', function(req, res) {


	var data = [
				{type:"pdf",name:"dossier1"},
				{type:"pdf",name:"dossier2"},
				{type:"pdf",name:"dossier3"},
				{type:"pdf",name:"dossier4"},
	];
	
    res.render('pages/list',{
    	data : data,
    });
});

app.post('/file/upload',function(req,res){
	var folder = req.param("folder");
	if(done==true){
		console.log(req.files);
		res.end("File uploaded.");
	}
});

app.get('/:folder', function(req, res){
	var folder = req.params.folder;
	//res.render('pages/machin',{var:values});
});

app.get('/:folder/:file', function(req, res){
	var folder = req.params.folder
    , file = req.params.file;
    res.sendFile('uploads/' + folder + '/' + file);
});

app.listen(8080);

console.log('8080 is the magic port');