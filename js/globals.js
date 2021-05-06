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
  new ACCommandComponent ()
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

window.addEventListener ('load', function () {
  (async() => {  
    await loadCommands ();
  })(); 
})
