//counter for the endpoint

var button = document.getElementById("counter");

button.onclick = function(){


// create a request

var request = new XMLHttpRequest();


// make a request



// save the request received and span the request
request.onreadystatechange =function(){
 if (request.readyState === XMLHttpRequest.Done){

  if (request.status === 200){
    var counter = request.responseText;
    var span = document.getElementById("count");
    span.innerHTML = counter.toString();
   
  }

 }

};
request.open('GET', "http://omkar2207.imad.hasura-app.io/counter", true);
request.send(null);
};



/*var counter =0;

var button = document.getElementById("counter");
button.onclick = function(){
var span = document.getElementById("count");
counter =counter+1;
span.innerHTML = counter.toString();
}
*/