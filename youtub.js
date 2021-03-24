const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var emailg="";

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
	console.log(user);
	if(user=="piyush")
	{
		res.send(user);
	}
	else
	{
		//res.status(401).send({ error: "Wrong username or password" });
		res.redirect('/');
		//res.send('<script>window.alert("Enter again")</script>');
		
	
	}
    res.sendStatus(200);
});
app.post('/qrform_post', (req, res) => {
	console.log('Got body:', req.body);
	res.setHeader('Content-Type', 'text/html'); 
	
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/qrcode";
	MongoClient.connect(url, function(err, db) 
	{
		if (err) throw err;
		var dbo = db.db("qrcode");
				
		var d = new Date();
		var n =d.getHours().toString()+":"+d.getMinutes().toString()+":"+d.getSeconds().toString();
		var m =d.getDate().toString()+":"+d.getMonth().toString()+":"+d.getFullYear().toString();
		
		var company=req.body.Name_of_Manufacture;
		var product=req.body.Product_Name;
		var batch=req.body.Batch_Number;
		var total=req.body.Number_Products_in_Batch;
		var regno=req.body.Registeration_Number;
		
		var suid=regno+company.substr(0,1)+batch+'0';
		var luid=regno+company.substr(0,1)+batch+total;
		
		
		var myobj = { email:emailg,Company:company,Product:product,Batch:batch,Start:suid,End:luid,Dat:m,Time:n };
		
		
		dbo.collection("record").insertOne(myobj, function(err, res) 
		{
			if (err) throw err;
			db.close();
			
		});
		
	});  
	
	res.redirect('/form.html');
    res.sendStatus(200);
});

app.post('/login_post', (req, res) => 
{
	emailg=req.body.Email;
    console.log('Got body:', req.body);
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/qrcode";
	MongoClient.connect(url, function(err, db) 
	{
		if (err) throw err;
		var dbo = db.db("qrcode");
		var email=req.body.Email;
		var pass=req.body.Password;
		var query = { Email: email,Password:pass };
		dbo.collection("user").find(query).toArray(function(err, result) 
		{
			if (err) 
			{
				res.redirect('/login.html');
			}
			if(result.length==0)
			{
				res.redirect('/login.html');
			}
			else
			{
				//res.setHeader('Content-Type', 'text/html'); 
				res.redirect('/form.html');
			}
			db.close();
		});
	});  
    
});

app.post('/signup_post', (req, res) => {
    console.log('Got body:', req.body);
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/qrcode";
	MongoClient.connect(url, function(err, db) 
	{
		if (err) throw err;
		var dbo = db.db("qrcode");
		var email=req.body.Email;
		var pass=req.body.Password;
		var use=req.body.Username;
		var myobj = { Username:use,Password:pass,Email:email };
		dbo.collection("user").insertOne(myobj, function(err, res) 
		{
			if (err) throw err;
			db.close();
		});
	});
res.setHeader('Content-Type', 'text/html'); 	
	res.redirect('/form.html');
    res.sendStatus(200);
});
app.get('/record',function(req,res){
	console.log(emailg);
	var sta=0;
var fs = require('fs')
fs.readFile('rc1.txt', (err, data) => { 
    if (err) throw err; 
    var dta=data.toString();
	fs.writeFile(emailg+'.html', dta, function (err) {
    if (err) throw err;
    console.log('Replaced!');
	sta=1;



if(sta==1)
{
var i=0;
var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/qrcode";
	
	MongoClient.connect(url, function(err, db) 
	{
		var res=[];
		if (err) throw err;
		var dbo = db.db("qrcode");
		var query = { email:"patil@gmail.com"};
		dbo.collection("record").find(query).toArray(function(err, result) 
		{	
			console.log(result.length);
			for(i=0;i<result.length;i++)
			{
				console.log(i);
			
			fs.appendFile(emailg+".html", "<tr>"+"<td>"+result[i].Company+"</td>"+"<td>"+result[i].Product+"</td>"+"<td>"+result[i].Batch+"</td>"+"<td>"+result[i].Start+"</td>"+"<td>"+result[i].End+"</td>"+"<td>"+result[i].Dat+"</td>"+"<td>"+result[i].Time+"</td>"+"</tr>", (err) => { 
			
			});
			}
				
		});
		console.log(res);
		db.close();
	}); 
//var fs = require('fs')
fs.readFile('rc2.txt', (err, data) => { 
    if (err) throw err; 
    var dta=data.toString();
	fs.appendFile(emailg+'.html', dta, function (err) {
    if (err) throw err;
    console.log('Replaced!');
});	
})
}
});	
})
res.sendfile(emailg+'.html');
});
app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.get('/login.html',function(req,res){
	res.sendfile('login.html');
});
app.get('/form.html',function(req,res){
	console.log(emailg);
	res.sendfile('form.html');
});
app.get('/signup.html',function(req,res){
	res.sendfile('signup.html');
});
app.listen(8080, () => console.log(`Started server at http://localhost:8080!`));