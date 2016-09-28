var express = require('express');
var morgan = require('morgan');
var path = require('path');

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

var articles = {

'Article-One' : {
	title : "Article One| Gopi krishna",
	heading :" Article One",
	date : " Sept 15, 2016 ",
	content : `This is article one`
},

'Article-Two' : {
	title : "Article Two| Gopi krishna",
	heading :" Article Two",
	date : " Sept 16, 2016 ",
	content : `This is article two`
},
			
'Article-Three' : {
	title : "Article Three| Gopi krishna",
	heading :" Article Three",
	date : " Sept 17, 2016 ",
	content : `This is article three`
}
};	


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

			  <a href='/'>Home</a>
  			  <hr>
			  <h1>${heading} </h1>
  			  <h2>${date}</h2>	
  			  <div>
    				<p>
    				${content}
  				</div>

			</div>

			</body>

			</html>`;

return htmlcontent;

}

app.get('/:articlename',function(req,res){

  var articlename =req.params.articlename; 	
  res.send(articledata(articles[articlename]));
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
