// let command_array2 = []
let controlsDiv = document.querySelector('[aria-labelledby="SimpleComponents"]');

// // Commands to array
// function getCommands(command_array) {
//   let json_database = getData();
//   let commands = json_database['nodes'][0];

//   for (const [key, value] of Object.entries(commands)) {
//     command_array.push([key, value]);
//   }
// }

// function getData() {

//   const xhr = new XMLHttpRequest();

//   xhr.open("GET", "./repository/simple/data_nodes.json", false);
//   xhr.send(null);

//   const response = JSON.parse(xhr.responseText)
//   return response
// }

// Async
function getPoster(simple_command_descriptors) {
    fetch("./repository/simple/data_nodes.json")
      .then(response => response.json())
      .then(response => {
          let commands = response['nodes'][0];
          for (const [key, value] of Object.entries(commands)) {
            simple_command_descriptors.push([key, value]);
          }
          simple_command_descriptors = simple_command_descriptors[0]
      }
      );
      
  }


window.addEventListener('load', () => {
    getPoster(simple_command_descriptors);
    setTimeout(() => {
        generateControlsToDropDowMenu();    
    }, 1000);
})

function generateControlsToDropDowMenu () {
    for (let i = 0; i < simple_command_descriptors.length; ++i) {
        let child = document.createElement('a');
        let text = document.createTextNode(`${simple_command_descriptors[i][0]}`);

        child.appendChild(text);
        child.setAttribute('class', 'dropdown-item no-href component');
        child.setAttribute('href', '#');
        child.setAttribute('guid', simple_command_descriptors[i][1]['data_guid'])

        controlsDiv.appendChild(child);
    }
}


const registerComponent = async function registerComponent (data) {
  let comp;
  try {
      comp = editor.getComponent (data.name);
  } catch (e) {
      comp = new SimpleComponent (data.name);

      editor.register (comp);
      engine.register (comp);
  } 

  return comp;
}


controlsDiv.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
        let guid = e.target.getAttribute ('guid');

        for (let desc of simple_command_descriptors) {
          let data = desc[1];
          if (data.data_guid === guid) {

            (async() => {            
              let comp = await registerComponent (data);
              let node = await comp.createNode(data);
          
              node.position = getPosition (184, 195);
            
              editor.addNode(node);

              editor.selected.clear ();
              editor.selected.list.push (node);
              editor.nodes.map(n => n.update());              
            })();

          }
        }

    }
})