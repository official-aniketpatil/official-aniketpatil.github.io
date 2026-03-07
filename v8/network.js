class GeoNetwork {

constructor(){
this.peer=null
this.id=null
this.connections={}
this.peers={}
this.heartbeatInterval=null
}

start(id){

this.peer = new Peer(id)

this.peer.on("open",(id)=>{
this.id=id
log("Connected as "+id)
})

this.peer.on("connection",(conn)=>{
this.setupConnection(conn)
})

this.peer.on("disconnected",()=>{
log("Peer disconnected, reconnecting")
this.peer.reconnect()
})

this.peer.on("error",(err)=>{
log("Error "+err)
})

this.startHeartbeat()
}

connect(id){

if(id===this.id) return
if(this.connections[id]) return

const conn=this.peer.connect(id)

conn.on("open",()=>{
this.setupConnection(conn)
})

}

setupConnection(conn){

const id=conn.peer

this.connections[id]=conn
this.peers[id]=Date.now()

log("Peer joined "+id)

conn.on("data",(data)=>{
this.handleData(id,data)
})

conn.on("close",()=>{
delete this.connections[id]
delete this.peers[id]
log("Peer left "+id)
})

}

handleData(id,data){

switch(data.type){

case "peer-list":
data.peers.forEach(p=>{
this.connect(p)
})
break

case "message":
log(id+": "+data.text)
break

case "heartbeat":
this.peers[id]=Date.now()
break

}

}

broadcast(data){

Object.values(this.connections).forEach(conn=>{
conn.send(data)
})

}

startHeartbeat(){

this.heartbeatInterval=setInterval(()=>{

this.broadcast({
type:"heartbeat"
})

this.checkPeers()

},5000)

}

checkPeers(){

const now=Date.now()

Object.keys(this.peers).forEach(id=>{

if(now-this.peers[id] > 15000){

log("Peer timeout "+id)

if(this.connections[id])
this.connections[id].close()

delete this.peers[id]

}

})

}

}