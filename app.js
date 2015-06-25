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
				return './public/images/';
			case 'file':
				var mkdirp = require("mkdirp");
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

app.get('/folders', function (req, res) {

	var toto = fafa;
	foldermysql.select(function (result){
		res.render('pages/folders', {data:result,});
	});
	
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
	var icon = req.body.icon;
	
	foldermysql.insert({"name":name,"creator":creator,"icon":icon});
});

app.get('/create/folder', function(req, res){
	res.render('pages/formFolder');
});

app.get('/:folder/delete/:id', function(req, res){

	if (req.params.id){
		var result = foldermysql.delete(req.params.id);

		/*fs.rmdir('path', function (error) {
			if(error){
				console.error('échec de la suppression du répertoire', error);
			} else {
				console.log('répertoire créé');
			}

		});
		*/

	}



//	res.render('pages/formFolder');
});




app.get('/:folder', function(req, res){
	var folder = req.params.folder;
	filesmysql.select(folder, function (result){
		res.render('pages/files', {dataresult:result});
	});
	//res.render('pages/machin',{var:values});
});

app.get('/:folder/:file', function(req, res){
	var folder = req.params.folder
    , file = req.params.file;
    res.download('uploads/' + folder + '/' + file);
});

app.listen(8080);

console.log('8080 is the magic port');