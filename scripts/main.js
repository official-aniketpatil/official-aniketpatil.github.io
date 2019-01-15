var myImage=document.querySelector('img');
myImage.onclick=function(){
	var mySrc=myImage.getAttribute('src');
	if(mySrc==='images/profile.jpg'){
		myImage.setAttribute('src','images/profile1.jpg');
	}else{
		myImage.setAttribute('src','images/profile.jpg');
	}
}
var myHeading=document.querySelector('h1');
