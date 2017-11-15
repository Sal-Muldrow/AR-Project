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

  socket.on("UserCreate", function(username, password){ // Recieves the User Create
      db.get('posts')
      .push({ id: 1, UserName: username, Password: password, data: []}) //Write User's details to database
      .write()
    
    
  });
  socket.on("GetUserData", function(username){ // when the user asks for their data

      io.emit('SendUserData', db.get('posts').find({ UserName: username }).value().data); // grab a users data at username

    
    
  });
  socket.on("CreateNewDataSet", function(username, DataName){ //When the user wants to create a new dataset

          var Obj = {title : DataName} // Create an object with the Data Set's Name
          var intitArray = db.get('posts').find({ UserName: username }).value().data; //keep the old array of data
          intitArray.push(Obj); // Add the new dataset to the inital array of datasets
          db.get('posts');
          .find({UserName: username})
          .get('data');
          .assign({ data: intitArray}) //rewrite the data array with everything included, old and new
          .write()
        
    
    
  });
    socket.on("UserAuth", function(username, password){ // when the user tries to sign in
      console.log(username);
      if(db.get('posts').find({ UserName: username }).value() == null){ // if user is not in database
        io.emit("UserNotFound");
        console.log("User Not Found!");
      }else{
        if(password != db.get('posts').find({ UserName: username }).value().Password){ // if password is wrong
        io.emit("PasswordFail");
        console.log("Wrong Password!");

      }else{
        io.emit("UserAuthSucc"); // if the Auth is successful 
        
      }


    }
    

    
  });


});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
