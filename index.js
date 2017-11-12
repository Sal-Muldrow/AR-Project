var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const low = require('lowdb');
const fs = require('fs');
var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync('db.json');
var db = low(adapter);



app.get('/', function(req, res){
  res.sendFile(__dirname + '/SignIn.html');
});
app.get('/SignUp.html', function(req, res){
  res.sendFile(__dirname + '/SignUp.html');
});
app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
/*
var DDATA = {data1: '1',data2:'2'};

db.get('posts')
  .find({ UserName: 'sad' })
  .assign({ data: DDATA })
  .write()
*/
fs.watchFile('db.json', (curr, prev) => {
FileSync = require('lowdb/adapters/FileSync');

adapter = new FileSync('db.json');
db = low(adapter);

});

io.on('connection', function(socket){

  console.log("a user connected"); 

  socket.on("chatmessage", function(msg){

    io.emit("chatmessage", msg);

  });

  socket.on("UserCreate", function(username, password){
  		db.get('posts')
		  .push({ id: 1, UserName: username, Password: password, data: []})
		  .write()
    
    
  });
  socket.on("GetUserData", function(username){

  		io.emit('SendUserData', db.get('posts').find({ UserName: username }).value().data);

    
    
  });
  socket.on("CreateNewDataSet", function(username, DataName){

          var Obj = {title : DataName}
          var intitArray = db.get('posts').find({ UserName: username }).value().data;
          intitArray.push(Obj);
          db.get('posts');
          .find({UserName: username})
          .get('data');
          .assign({ data: intitArray})
          .write()
        
    
    
  });
    socket.on("UserAuth", function(username, password){
    	console.log(username);
    	if(db.get('posts').find({ UserName: username }).value() == null){
    		io.emit("UserNotFound");
    		console.log("User Not Found!");
    	}else{
    		if(password != db.get('posts').find({ UserName: username }).value().Password){
    		io.emit("PasswordFail");
    		console.log("Wrong Password!");

    	}else{
    		io.emit("UserAuthSucc");
    		
    	}


  	}
    

    
  });


});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
