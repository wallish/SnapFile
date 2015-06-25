var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;
var bodyParser = require('body-parser');
var fs = require('fs');
var filesmysql = require("./models/Files");
var foldermysql = require("./models/Folders");


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/',
	changeDest: function(dest, req, res){
		switch(req.body.form)
		{
			case 'folder':
				var mkdirp = require("mkdirp");
				mkdirp('./uploads/'+req.body.name, function (err) {
			    	if (err) console.error(err);
			    	else console.log('Folder created.');
				});
				return './public/images/';
			case 'file':
				var name = req.body.name;
				return dest+name;
		}
	},
	/*rename: function (fieldname, filename, req, res) {
		return filename;
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



app.post('/post/file',function(req,res){
	var folder = req.body.folder;
	var creator = req.body.creator;
	var expire = req.body.expire;
	if(done==true){
		
		console.log(req.files);
		//console.log(req.files.sharedFile.originalname);
		//folder, originalName, creator, type, downloadcount, expire
		filesmysql.insert({"folder":folder,"originalName":req.files.sharedFile.originalname,"creator":creator,"type":req.files.sharedFile.extension,"downloadcount":0,"expire":expire});
	}
});

app.post('/post/folder', function(req, res){
	var name = req.body.name;
	var creator = req.body.creator;
	console.log(req.files);
	var icon = req.files.icon.originalname;
	
	foldermysql.insert({"name":name,"creator":creator,"icon":icon});
	res.end("Folder created");
});


/******* Listage des repertoires ******/
app.get('/folders', function (req, res) {
	
	res.render('pages/folders');
});

app.get('/get/folders', function(req, res){
	foldermysql.select(function (result){
		res.render('partials/folderslist', {data:result});
	});
});
/******* FIN Listage des repertoires ******/

/******* Listage des fichiers *******/
app.get('/:folder', function(req, res){
	res.render('pages/files');
	//res.render('pages/machin',{var:values});
});

app.get('/get/files/:folder', function(req, res){
	var folder = req.params.folder;
	filesmysql.select(folder, function (result){
		res.render('partials/fileslist', {dataresult:result});
	});
});
/******* FIN Listage des fichiers *******/

app.get('/:folder/:file', function(req, res){
	var folder = req.params.folder
    , file = req.params.file;
    res.download('uploads/' + folder + '/' + file);
});

app.listen(8080);

console.log('8080 is the magic port');