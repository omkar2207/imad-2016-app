
var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    
var request = new XMLHttpRequest();


// make a request



// save the request received and span the request
request.onreadystatechange =function(){
    if (request.readyState === XMLHttpRequest.DONE){

         if (request.status === 200){
            console.log('user logged in');
            alert('logged in sucessfully');
            
         } else if(request.status===403){
             console.log('username / password invalid');
            alert('username/ password invalie');
         } else if(request.status===500){
             console.log('something went wrong on the server');
            alert('something went wrong on the server');
         }

    }
};


var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
request.open('POST', "http://omkar2207.imad.hasura-app.io/login", true);
request.send(JSON.stringify({username: username, password: password}));
console.log(username);
console.log(password);
   
};
