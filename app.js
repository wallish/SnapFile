var express = require('express');
var app = express();
var multer  = require('multer');
var done=false;
var bodyParser = require('body-parser');
var fs = require('fs');
var filesmysql = require("./models/Files");
var foldermysql = require("./models/Folders");
var usersmysql = require("./models/Users");
var rimraf = require("rimraf");

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: './uploads/',
	changeDest: function(dest, req, res){
		switch(req.body.form)
		{
			/*case 'folder':
				return './public/images/foldericons';*/
			case 'file':
				var folder = req.body.folder;
				console.log(folder);
				return dest+folder;
		}
	},
	rename: function (fieldname, filename, req, res) {
		switch(req.body.form) {
			/*case 'folder':
				return req.body.name+filename.substr(filename.lastIndexOf(".")+1);*/
			case 'file':
				return filename;
		}
		
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


app.post('/post/file',function (req,res){
	var folder = req.body.folder;
	var creator = req.body.creator;
	console.log("/post/file -> folder to upload : "+folder);
	var expire = 60;
	//var expire = req.body.expire;
	if(done==true){
		filesmysql.insert({"folder":folder,"originalName":req.files.sharedFile.originalname,"creator":creator,"type":req.files.sharedFile.extension,"downloadcount":0,"expire":expire});
		res.end("File uploaded");
	}
});

app.post('/post/folder', function (req, res){
	var name = req.body.name;
	var creator = req.body.creator;
	var expire = req.body.expire*60;
	console.log(req.files);
	//var icon = name+"."+req.files.icon.extension;
	var mkdirp = require("mkdirp");
	mkdirp('./uploads/'+req.body.name, function (err) {
    	if (err) console.error(err);
    	else console.log('Folder created.');
	});
	
	foldermysql.insert({"name":name,"creator":creator,"icon":"null","expire":expire});
	res.end("Folder created");
});

app.get('/:folder/:file/delete', function (req, res){

	if (req.params.file){
		//var result = foldermysql.delete(req.params.file);

		fs.unlink('uploads/'+req.params.folder+'/'+req.params.file, function (error) {
			if(error){
				console.error('échec de la suppression du fichier', error);
			} else {
				console.log('fichier supprimé');
				filesmysql.update(req.params.file, "deleted=1");
			}
		});
		res.end("Fichier supprimé");
	}

//	res.render('pages/formFolder');
});

app.get("/:folder/delete", function(req, res){
	var folder = req.params.folder;
	deleteFolder(folder);
	res.end("Répertoire supprimé");
})

app.get('/check/:folder', function(req, res) {
	var folder = req.params.folder;
	foldermysql.select("name='"+folder+"'",function (result){
		res.json(result);
	});
});

/******* Listage des repertoires ******/
app.get('/folders', function (req, res) {
	
	res.render('pages/folders');
});

app.get('/get/folders', function(req, res){
	foldermysql.select("all",function (result){
		console.log(result);
		res.render('partials/folderslist', {data:result});
	});
});
/******* FIN Listage des repertoires ******/

/******* Listage des fichiers *******/
app.get('/:folder', function (req, res){
	var folder = req.params.folder;
	foldermysql.select("name='"+folder+"'",function (result){
		console.log(result);
		res.render('pages/files', {folder:result[0]});
	});
	
});

app.get('/get/files/:folder', function (req, res){
	var folder = req.params.folder;
	filesmysql.select(folder, function (result){
		
		res.render('partials/fileslist', {data:result, folder:folder});
	});
});
/******* FIN Listage des fichiers *******/

app.get('/:folder/:file', function (req, res){
	var folder = req.params.folder
    , file = req.params.file;
    filesmysql.update(file, "downloadCount=downloadCount+1");
    res.download('uploads/' + folder + '/' + file);

});

app.listen(8080);

console.log('8080 is the magic port');

function deleteFolder(foldername){
	/*fs.unlink("public/images/foldericons/"+results[result].icon,function (error) {
		if(error){
			console.error('échec de la suppression de l\'icone', error);
		} else {
			console.log('icone supprimé');
		}
	});*/
	rimraf('uploads/'+foldername, function (error) {
		if(error){
			console.error('échec de la suppression du répertoire', error);
		} else {
			console.log('répertoire supprimé');
			foldermysql.delete(foldername);
		}
	});
}

setInterval(function(){ 
	foldermysql.select("todelete", function (results){
		if(results.length > 0){
			for(result in results){
				deleteFolder(results[result].name);
			}
		}
	});
}, 60000);

