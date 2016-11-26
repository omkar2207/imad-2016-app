var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  host: 'db.imad.hasura-app.io',
  port : '5432',
  user: 'omkar2207',
  database: 'omkar2207',
  password: process.env.DB_PASSWORD,
};



var app = express();
app.use(morgan('combined'));

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
