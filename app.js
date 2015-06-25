var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;
var bodyParser = require('body-parser');
var rimraf = require('rimraf');
var fs = require('fs');
var filesmysql = require("./models/Files");
var foldermysql = require("./models/Folders");
var usersmysql = require("./models/Users");


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/',
	changeDest: function(dest, req, res){
		switch(req.body.form)
		{
			case 'folder':
				return './public/images/';
			case 'file':
				var folder = req.body.folder;
				console.log(folder);
				return dest+folder;
		}
	},
	rename: function (fieldname, filename, req, res) {
		return filename;
	},
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

		usersmysql.select(function (result){
		res.render('pages/index', {data:result,});
	});
});


app.post('/post/file',function(req,res){
	var folder = req.body.folder;
	var creator = req.body.creator;
	console.log(folder);
	var expire = 10000;
	//var expire = req.body.expire;
	if(done==true){
		filesmysql.insert({"folder":folder,"originalName":req.files.sharedFile.originalname,"creator":creator,"type":req.files.sharedFile.extension,"downloadcount":0,"expire":expire});
		res.end("File uploaded");
	}
});

app.post('/post/folder', function(req, res){
	var name = req.body.name;
	var creator = req.body.creator;
	console.log(req.files);
	var icon = req.files.icon.originalname;
	if(done == true) {
		var mkdirp = require("mkdirp");
		mkdirp('./uploads/'+req.body.name, function (err) {
	    	if (err) console.error(err);
	    	else console.log('Folder created.');
		});
	}
	foldermysql.insert({"name":name,"creator":creator,"icon":icon});
	res.end("Folder created");
});

app.get('/:folder/file/delete/:file', function(req, res){

	if (req.params.file){
		//var result = foldermysql.delete(req.params.file);

		fs.rmdir('uploads/'+req.params.file+'/'+req.params.file, function (error) {
			if(error){
				console.error('échec de la suppression du répertoire', error);
			} else {
				console.log('répertoire supprimé');
				foldermysql.delete(req.params.file)
			}
		});
	}
//	res.render('pages/formFolder');
});

app.get('/:folder/delete', function(req, res){

	if (req.params.folder){

		rimraf('uploads/'+req.params.folder, function (error) {
			if(error){
				console.error('échec de la suppression du répertoire', error);
			} else {
				console.log('répertoire supprimé');
				foldermysql.delete(req.params.folder)
			}
		});
	}
//	res.render('pages/formFolder');
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
	var folder = req.params.folder;
	res.render('pages/files', {folder:folder});
});

app.get('/get/files/:folder', function(req, res){
	var folder = req.params.folder;

	filesmysql.select(folder, function (result){
		res.render('partials/fileslist', {data:result, folder:folder});
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