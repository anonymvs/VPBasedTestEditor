let command_array = []
let command_array2 = []
let controlsDiv = document.querySelector('[aria-labelledby="SimpleComponents"]');

// Commands to array
function getCommands(command_array) {
  let json_database = getData();
  let commands = json_database['nodes'][0];

  for (const [key, value] of Object.entries(commands)) {
    command_array.push([key, value]);
  }
}

function getData() {

  const xhr = new XMLHttpRequest();

  xhr.open("GET", "./repository/simple/data_nodes.json", false);
  xhr.send(null);

  const response = JSON.parse(xhr.responseText)
  return response
}

// Async
function getPoster(command_array2) {
    fetch("./repository/simple/data_nodes.json")
      .then(response => response.json())
      .then(response => {
          let commands = response['nodes'][0];
          console.log('siker?: ', commands);
          for (const [key, value] of Object.entries(commands)) {
            command_array2.push([key, value]);
            //console.log(`${key}: ${value}`);
          }
          console.log('itt meg jo? : ', command_array2[0]);
          command_array2 = command_array2[0]
      }
      );
      
  }


window.addEventListener('load', () => {
    getPoster(command_array2);
    setTimeout(() => {
        generateControlsToDropDowMenu();    
    }, 1000);
})

function generateControlsToDropDowMenu () {
    for (let i = 0; i < command_array2.length; ++i) {
        let child = document.createElement('a');
        let text = document.createTextNode(`${command_array2[i][0]}`);

        child.appendChild(text);
        child.setAttribute('class', 'dropdown-item no-href component');
        child.setAttribute('href', '#');

        controlsDiv.appendChild(child);
    }
}