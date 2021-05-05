// Commands to array
function getCommands(command_array) {
  let json_database = getData();
  let commands = json_database['nodes'][0];

  for (const [key, value] of Object.entries(commands)) {
    command_array.push([key, value]);
    //console.log(`${key}: ${value}`);
  }
}

function getData() {

  const xhr = new XMLHttpRequest();

  xhr.open("GET", "./repository/simple/data_nodes.json", false);
  xhr.send(null);

  const response = JSON.parse(xhr.responseText)
  return response
}

let command_array = []
getCommands(command_array);

let controlsDiv = document.querySelector('[aria-labelledby="SimpleComponents"]');

function generateControlsToDropDowMenu () {
    
    for (let i = 0; i < command_array.length; ++i) {
        
        let child = document.createElement('a');
        let text = document.createTextNode(`${command_array[i][0]}`);

        child.appendChild(text);
        child.setAttribute('class', 'dropdown-item no-href component');
        child.setAttribute('href', '#');

        controlsDiv.appendChild(child);
    }
}

generateControlsToDropDowMenu();
console.log(controlsDiv);