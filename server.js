var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
  host: 'db.imad.hasura-app.io',
  port : '5432',
  user: 'omkar2207',
  database: 'omkar2207',
  password: process.env.DB_PASSWORD,
};



var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomNumber',
    cookie: { maxAge: 1000*60*60*24*30 }
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter +1;
  res.send(counter.toString());
});

	


function articledata(data){

var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;


var htmlcontent =	`<html>
			<head>
				<title>
	 			${title}
				</title>
			<link href="/ui/style.css" rel="stylesheet" />
			</head>

			<body>

			<div class= "container">

			  
			  <h1>${heading} </h1>
  			  <h2>${date.toDateString()}</h2>	
  			  <div>
    				<p>
    				${content}
    				</p>
  			  </div>
  			  
  			  
  			</body>

			</html>`;

return htmlcontent;

}
var names =[];
app.get('/submit-name', function(req,res){
    var name = req.query.name;
    names.push(name);
    res.send(JSON.stringify(names));
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a response with the results
    
    pool.query('SELECT * FROM test', function(err,result){
       if (err) {
           res.status(500).send(err.toString());
       }else{
            res.send(JSON.stringify(result.rows));   
            
       }
    });
    
    
});

app.get('/articles/:articlename',function(req,res){

pool.query('SELECT * FROM articles WHERE title = $1',[req.params.articlename],function(err,result){
   
   if (err){
       res.status(500).send(err.toString());
   } else {
       if(result.rows.length===0){
           res.status(404).send('Article not found');
       }else{
           var articleData = result.rows[0];
           res.send(articledata(articleData));

       }
       
   }
    
});
});

function hash (input,salt){
    var hashed = crypto.pbkdf2Sync(input, salt,10000,512,'sha512');
    return ["pbkdf2",salt,"10000",hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'This-is-a-test-string'); 
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
    
   var username = req.body.username;
   var password = req.body.password;
   
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('INSERT into "user" (username,password) VALUES ($1,$2)',[username,dbString], function(err,result){
       if (err) {
           res.status(500).send(err.toString());
       }else{
            res.send('user suceesfully created : '+ username);   
            
       }
       
   });
    
});

app.post('/login',function(req,res){
    
   var username = req.body.username;
   var password = req.body.password;
   pool.query('SELECT * FROM "user" WHERE username = $1',[username], function(err,result){
       if (err) {
           res.status(500).send(err.toString());
       }else{
           if (result.rows.length === 0){
            res.status(403).send('user/password invalid');
           }else{
               var dbString = result.rows[0].password;
               var salt = dbString.split('$')[1];
               var hashedPassword = hash(password , salt);
               if (hashedPassword === dbString) {
                   
                   //set the session
                   req.session.auth = {userId: result.rows[0].id};
                   console.log(result.row[0].id);
                   
                   res.send('Credentials Valid');
                  
               }else{
                   res.status(403).send('username/Password invalid');
               }
           }
            
       }
       
   });
    
    
});

app.get('/check-login',function (req,res){
   
   if (req.session && req.session.auth && req.session.auth.userId){
       res.send('you are logged in: ' + req.seesion.auth.userId.toString());
   } else {
       res.send('you are not logged in');
   }
}) ;  

app.get('/logout', function(req,res){
   delete req.session.auth;
   res.send('you are logged out');
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
