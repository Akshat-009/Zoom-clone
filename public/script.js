const socket=io('/')
const videogrid=document.querySelector('.video-grid');


const myPeer=new Peer(undefined,{
    host:"/",
    port:"3001",
})
const myvideo=document.createElement('video')
myvideo.muted=true
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}).then(stream =>{
   addvideostream(myvideo,stream)
   myPeer.on('call',call=>{
       call.answer(stream)
       const video = document.createElement('video')
       call.on('stream',uservideostream=>{
           addvideostream(video,uservideostream)
       })
   })
   socket.on('user-connected',userId=>{
   connectToUser(userId,stream)    

})
})
myPeer.on('open',id=>{
    
    socket.emit('new-user-joined',ROOM_ID,id)
})


function addvideostream(video,stream)
{
    video.srcObject =stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videogrid.append(video)
}
const peers={}
function connectToUser(userId,stream)
{
    const call=myPeer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',uservideostream=>{
        addvideostream(video,uservideostream)
    })
    call.on('close',()=>{
        video.remove()
    })
    peers[userId]=call
}
socket.on('user-disconnected',userId=>{
    if (peers[userId])peers[userId].close()

})