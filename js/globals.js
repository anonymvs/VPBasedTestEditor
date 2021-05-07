var editor;
var engine;

const test_types = {
	DEFAULT: "default_test_template",
	DATA_DRIVEN: "datadriven_test_template",
	SPEED: "speed_test_template"
}

var state = {
  type: test_types.DEFAULT
};

var components = [
  new NumComponent (), 
  new StrComponent (), 
  new Coord2DComponent (), 
  new Coord3DComponent (), 
  new SimpleComponent (''), 
  new BeginComponent (), 
  new EndComponent (),
  new ACCommandComponent (),
  new StepComponent ()
];

var simple_command_descriptors = [];

var ac_commands = [];

async function loadCommands() {
  if (ac_commands.length === 0) {
    await fetch("./repository/ac_commands/ac_commands.json")
      .then(response => response.json())
      .then(response => {
          let commands = response['commands'];
          for (const command of Object.entries(commands)) {
            ac_commands.push(command[1]['command']);
          }
          // for (const [key, value] of Object.entries(commands)) {
          //   ac_commands.push(value['command']);
          // }
      }
    );
  }
}

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

window.addEventListener ('load', function () {
  (async() => {  
    await loadCommands ();

    var table = document.getElementById("myTable");
    for (const command of ac_commands) {
      let row = table.insertRow(0);
      let cell = row.insertCell(0);
      cell.innerHTML = command;
    }
   
    // $('.ok').on('click', function(e){
    //    //alert($("#myTable tr.selected td:first").html());
    // });

  })(); 

  // let table = document.getElementById("myTable");
  // table.addEventListener ('click', e => function (e) {
  //   var thisIsTheShit = e.target;
  //   console.log (thisIsTheShit);
  // });
})


function getTemplate (beg_node, end_node, template_type) {

  let file_path = '';

  switch (template_type) {
      case 'default_test_template':
          file_path += './repository/script_resources/_template.json';
        break;

      case 'datadriven_test_template':
          file_path += './repository/script_resources/_template_data_driven.json';
          break;

      case 'speed_test_template':
          file_path += './repository/script_resources/_template_speed.json';
          break;
      default:
          alert ('Resource for template type does not exist yet.');
          return;
  }
          
          
  fetch(file_path)
    .then(response => response.json())
    .then(response => {
        beg_node.data.perl = response['start'];
        end_node.data.perl = response['end']
    }
    );
    
}





