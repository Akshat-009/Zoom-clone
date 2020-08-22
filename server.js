const express=require('express')
const app= express()
const server= require('http').Server(app)
const io=require('socket.io')(server)
const {v4:uuidv4}=require('uuid')
app.set('view engine','ejs')
app.use(express.static('public'))
app.get('/',function(req,res){
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})
server.listen(8080,()=>{
    console.log("Started on port 8080")
})
io.on('connection',(socket)=>{
    socket.on('new-user-joined',(roomId,userId)=>{
        
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('disconnect',()=>{
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})