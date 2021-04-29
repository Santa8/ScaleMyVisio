const router = require('express').Router();
const path = require('path');

const shell = require('shelljs') ;
const exec = require('child_process').exec;
const { spawn } = require('child_process');


const User = require('../src/User');
const Room = require('../src/Rooms');


//const { joinRoom } = require('../public/index');



function data_roomCreated(user,RoomId){

    


}



router.post('/RoomClientList', async function(req,res){
    

    console.log("RoomClientList")

    var Id = req.body.Id;
    var roomId = req.body.roomId;
    console.log(roomId)

    const room = await Room.findOne({name:roomId})
    var list = room.participant
    console.log(list)


    try{

        res.send({value:true,list:list})
    }
    catch(err){
        res.send(err);
    }



  });


router.post('/infoRequest', async function(req,res){
    
    console.log("infoRequest")
    const user = await User.findOne({email:req.body.email})

    res.send(user._id)
  });

  
router.post('/exitRoom',function(req,res){
     
    var Id = req.body.Id;

    res.send({value:true});
  });


  router.post('/exit',function(req,res){

    //console.log("User exited")
    if (typeof window !== 'undefined') {
        // do your stuff with sessionStorage
        sessionStorage.setItem('user', "qalwa");
        console.log(sessionStorage.getItem('user'))
        user.Id = 0;
    }
    
    //console.log(user_name)
   // console.log(roomId)
    

    //joinRoom("yahya", "11");
    res.sendFile('index.html', { root: path.join(__dirname, '../public') });




});


router.post('/creatRoom', async function(req,res){
    var user_name = req.body.name;
    var roomName = req.body.roomId;
    var Id = req.body.Id;
     
    const room = new Room({
            admin : Id,
            name : roomName,           
    });

        try{
            const user = await User.findOne({_id:Id})
            user.room = roomName;
            user.role = 1;
            const savedUser =  await user.save();

            room.participant.push({Id:Id,username:user_name});
            const savedRoom =  await room.save();
            res.send({value:true})
        }
        catch(err){
            res.send(err);
    }


  });


  router.post('/joinRoom', async function(req,res){
    var user_name = req.body.name;
    var roomName = req.body.roomId;
    var Id = req.body.Id;


    const room = await Room.findOne({name:roomName})

    if(!room){


        try{
            console.log("saba")
            res.send({value:false,message:"Room Not Found"});
        }
        catch(err){
            res.send(err);
    }}
    else{
        try{
            const user = await User.findOne({_id:Id})
            user.room = roomName;
            user.role = 2;
            const savedUser =  await user.save();

            room.participant.push({Id:Id,username:user_name});
            const savedRoom =  await room.save();
            res.send({value:true})
        }
        catch(err){
            res.send(err);
        }
    }
    
  });

router.post('/stream',function(req,res){


    console.log("streaaaam");
    try {
        
        const child =exec("./stream.sh");

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
   
        res.status(204).send();
     }
    catch(err){
        res.status(400).send(err);
    }
    
  });


router.get('/LogIn',  (req,res)=>{
    try{    
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});



router.get('/Register',  (req,res)=>{
    try{    
        res.sendFile('Register.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/streaming',  (req,res)=>{
    try{    
        res.sendFile('streaming.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/home',  (req,res)=>{
    try{    
        res.sendFile('Home.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/index',  (req,res)=>{
    try{    
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});
router.get('/visio',  (req,res)=>{
    try{    
        res.sendFile('Visio.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.get('/admin',  (req,res)=>{
    try{    
        res.sendFile('admin.html', { root: path.join(__dirname, '../public') });
    }
    catch(err){
        res.status(400).send(err);
    }
});


module.exports = router;