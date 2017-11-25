<!doctype html>
<html>
  <head>
      <!--Import Google Icon Font-->
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="/materialize/css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script> 
    
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/core.js"></script>
    <script src="/handsontable/dist/handsontable.full.js"></script>
    <link rel="stylesheet" media="screen" href="/handsontable/dist/handsontable.full.css">
    <title>Socket.IO chat</title>
    <style>
      textarea {
        resize: none;

      }
      #container.handsontable table{
        width:100%;
      }
      .nav-wrapper {
        background-color: #1e88e5 !important;
        color: white;
      }
    </style>
  </head>
  <body>

      <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="/materialize/js/materialize.min.js"></script>

    
  
    <ul id="slide-out" class="side-nav" style="">
        <li><div class="user-view">
          <div class="background">
            
          </div>
          
          
        <li><a href="#!"><i class="material-icons">collections_bookmark</i>Your Datasets:</a></li>

        <div id="menu">
        <li><div class="divider"></div></li>
        <!---<li><a href="" class="waves-effect waves-light  modal-trigger" href="#modal1">Create A New Dataset<i class="material-icons">add</i></a></li> -->
        <li><div class="divider"> </div></li>
        </div>
      </ul>
      
      <nav>
      <span class="blue-text text-darken-2">
          <div class="nav-wrapper" >
            <a href="#" class="brand-logo center">AR-Project</a>
            <ul id="nav-mobile" class="left hide-on-med-and-down">
              <li><a href="#" data-activates="slide-out" id="button-collapse" class="waves-effect waves-light">Datasets</a></li>
              <li><a class="waves-effect waves-light  modal-trigger" href="#modal1">Import Data</a></li>
              <li><a href="" class="waves-effect waves-light"  >Create Charts</a></li>
            </ul>
          </div>
        </span>
      </nav>

    <div id="example" ></div>
    <!-- Modal Trigger -->
    

    <!-- Modal Structure -->
    <div id="modal1" class="modal">
      <div class="modal-content">
      <form action="" id="dataform">
        <textarea rows="4" cols="50" id="areadata">
      
        </textarea>
        
        <button>Add data</button>
        </form>
        
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-green  ">Agree</a>
      </div>
    </div>
    <div id="modal2" class="modal">
      <div class="modal-content">
        <form action="" id="datasetform">
          <input id="DataName" autocomplete="off" />
          <button>Create New Data Set</button>
        </form>
        
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-green  ">Agree</a>
      </div>
    </div>

    <H1 id="Title"></H1>
    <ul id="messages"></ul>

    <h3>Your Datasets:</h3>
    

    
    <div id="ChartMenu"></div>


    <script>
      $(document).ready(function(){
          // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
          $('.modal').modal();
          $('.modal2').modal();
        });
       
    


      $(function () {
       $('#button-collapse').sideNav({
            menuWidth: 300, 
            edge: 'left',
            closeOnClick: true, 
            draggable: true, 
            onOpen: function(el) {  }, 
            onClose: function(el) {  }, 
          }
        );
          $('.collapsible').collapsible();

        var socket = io();
        var MyUserName;
        var CurDS;
        var MyUserName = document.cookie;
        var MyData;

        
        socket.emit("GetUserData", MyUserName);
        function GetDataSet(Dataset, i){
            
            console.log(MyData[i]);
            CurDS = MyData[i].title;
            socket.emit("GetDataSet", MyUserName, CurDS);

        } 




        $('#datasetform').submit(function(){ //When create data set form is submitted

        

          //Send the backend our dataset name
          socket.emit("CreateNewDataSet", MyUserName, $('#DataName').val());
          $('#DataName').val(''); //empty these values in the UI
          
          
          
      
        });
        $('#dataform').submit(function(){ //When data form is submitted

        

          
          socket.emit("AddNewData", MyUserName, $('#areadata').val(), CurDS);
          $('#areadata').val(''); //empty these values in the UI
          
          
          
      
        });
        socket.on("SendDataSet", function(data){
        document.getElementById("example").innerHTML = "";
        data = String(data);
        DataArray = data.split("\n");
        console.log(DataArray);
        var a = [];
        var b = [];
        for (var i = 0; i < DataArray.length; i++) {

          
          b.push(DataArray[i].split(","));
          


  

          a = [];


        }
        DataArray = b;
        console.log(DataArray);
        var data = [
          ["1", "Ford", "Volvo", "Toyota", "Honda", "wow", "10"],
          [1,1, 10, 11, 12, 13,14],
          [2, 20, 11, 14, 13,14],
          [3, 30, 15, 12, 13,14]
        ];

        var container = document.getElementById('example');
        var hot = new Handsontable(container, {
          data: DataArray,
          
          rowHeaders: true,
          colHeaders: true,
          contextMenu: true,
          contextMenu: {
            items: {
              "Create A Chart": {
                name: 'Create A Chart',
                callback: function(key, options) {
                  var selection = this.getSelectedRange();
                  var fromRow = Math.min(selection.from.row, selection.to.row);
                  var toRow = Math.max(selection.from.row, selection.to.row);
                  var fromCol = Math.min(selection.from.col, selection.to.col);
                  var toCol = Math.max(selection.from.col, selection.to.col);
                  console.log(this.getData(fromRow, fromCol, toRow, toCol));
                  document.getElementById("Title").innerHTML = "selcted data is: " + this.getData(fromRow, fromCol, toRow, toCol);
                  for (var row = fromRow; row <= toRow; row++) {
                    for (var col = fromCol; col <= toCol; col++) {
                     //cycle through all the cells
                      
                        
                    }
                  }
                  
                  this.render();
                }
              }
            }
          }

        });

        

            
        
          window.scrollTo(0, document.body.scrollHeight);
        });
        socket.on("SendUserData", function(data){
          
          
          for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            NewData = data[i].title;
            MyData = data;

            var btn = document.createElement("li");
            btn.innerHTML =  "<a>"+data[i].title+"</a>";
            
            btn.onmousedown = (function(NewData, i){
                 return function(){
                     GetDataSet(NewData, i);
                 }
            })(NewData, i);
        
            document.getElementById("menu").appendChild(btn);

            
        }
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
    </script>
  <script>
  
  
  </script>
  </body>
</html>
