const network = new GeoNetwork()

function log(msg){

const box=document.getElementById("log")

box.innerHTML += msg+"<br>"
box.scrollTop=box.scrollHeight

}

function createRoom(){

const roomId="room-"+Math.floor(Math.random()*99999)

network.start(roomId)

document.getElementById("room").innerText=
"Room ID: "+roomId

}

function joinRoom(){

const id=prompt("Room ID")

network.start()

setTimeout(()=>{
network.connect(id)
},1000)

}

function sendMessage(){

const msg=document.getElementById("message").value

network.broadcast({
type:"message",
text:msg
})

log("me: "+msg)

}