console.log('Loaded!');
// to change the text in HTML
var element = document.getElementById ("main-text");
element.innerHTML = "New Text";

// to move the image when clicked

var img = document.getElementById("image");

var right=0;
function moveRight(){
    right = right +10;
    img.style.marginLeft = right+"px";
}

img.onclick = function(){
setInterval(moveRight, 50);
};
