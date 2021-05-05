const endline = '\n';


class Exporter {
  constructor(nodes){
    // TODO: make it into a more reasonable data structure for a graph
    //  - we need more about the possible control nodes

    this.header = '';
    this.init = '';
    this.main = '';
    this.end = '';
    this.subrutines = '';

    this.processed_inputs = new Map ();

    this.control_flow = this.select_control_flow (nodes);   // ordered sequence of nodes connected by the control sockets  

    this.export = this.export.bind (this);
    //this.process_input = this.process_input.bind (this);
  }


  select_control_flow (nodes) {
    let ret = [];

    let start = nodes.find (node => node.name === 'Begin');
    let end = nodes.find (node => node.name === 'End');

    if (typeof start !== 'undefined' && typeof end !== 'undefined') {

      let current = start;
      while (current !== end) {
        for (let key of current.outputs.keys()) {
          
          //  //current.getConnections ();
          //  for (let connections of current.getConnections ()) {
          //   if (typeof connections.output !== 'undefined') {
  
          //     for (let c of connections.output.connections) {
          //       let output = c.input;

          if (key === 'void') {  // type key of socket e.i.: 'str'
            let connections = current.outputs.get (key).connections;
            if (typeof connections !== 'undefined') {
              if (connections.length == 1) {
                current = connections[0].input.node;
                if (current !== end)
                  ret.push (current);

                break;
              } else {
                alert ('Multiple routes for control flow found.');
              }
            }
          }
        }
      }

      return ret;
    } else {
      alert ("You can't export a sequence without a start- and an endnode.");
      return [];
    }
  }

  
  get_signature_name (node) {
    return node.name + '_' + node.id;
  }


  process_input (signature, name, id, data) {
    let str = ''; 
    let value;
    let variables = [];
    switch (name) {
      case 'Void':
        alert ('This is not supposed to be here.');
        break;

      case 'Number':
        value = data['num'];
        variables.push (signature);
        str += 'my @' + signature + ' = ' + String (value) + ';' + endline;
        break;

      case 'String':
        value = data['str'];
        variables.push (signature);
        str += 'my @' + signature + " = '" + String (value) + "';" + endline;
        break;

      // TODO: rework this... this is horrible maybe functions idunno
      case 'Coord2D': {
        let x = data['coordX'];
        let signature_x = signature + '_x';
        str += 'my @' + signature_x + ' = ' + String (x) + ';' + endline;
        variables.push (signature_x);

        let y = data['coordY'];
        let signature_y = signature + '_y';
        str += 'my @' + signature_y + ' = ' + String (y) + ';' + endline;
        variables.push (signature_y);

        break;
      }
      case 'Coord3D': {
        let x = data['coordX'];
        let signature_x = signature + '_x';
        str += 'my @' + signature_x + ' = ' + String (x) + ';' + endline;
        variables.push (signature_x);

        let y = data['coordY'];
        let signature_y = signature + '_y';
        str += 'my @' + signature_y + ' = ' + String (y) + ';' + endline;
        variables.push (signature_y);

        let z = data['coordZ'];
        let signature_z = signature + '_z';
        str += 'my @' + signature_z + ' = ' + String (z) + ';' + endline;
        variables.push (signature_z);
        break;
      }
      default:
        return '';
    }

    this.processed_inputs.set (id, variables);

    str += endline;
    return str;
  }


  write_main (node) {

    for (let [key, value] of node.inputs) {
      if (key === 'control')
        continue;

      let input_node;
      let connections = value.connections;
      if (typeof connections !== 'undefined') {
        input_node = connections[0].output.node;  
      }      

      let input_name = this.get_signature_name (input_node);

      // Declaring variables if not processed already
      if (!this.processed_inputs.has (input_node.id)) {  
        // Processes variable name and value, and return the declaration string 
        this.main += this.process_input (input_name, input_node.name, input_node.id, input_node.data);
      } else {
        this.processed_inputs.get(input_node.id).push (input_name);
      }
    }

    let func_name       = this.get_signature_name (node);
    let input_variables = [];
    for (let value of this.processed_inputs.values ()) {
      input_variables.push.apply(input_variables, value);
    }
    // let input_variables = this.processed_inputs.get (input_node.id);

    // function call
    this.main += '_' + func_name + ' (';
    for (let i = 0; i < input_variables.length; ++i) {
      this.main += '@' + input_variables[i];
      if (i < input_variables.length - 1)
        this.main += ', ';
    }
    this.main += ');' + endline;

  }

  write_subrutines (node) {

    this.subrutines = "sub _" + this.get_signature_name(node) + " {" + endline;

    for (const param of node.data.input) {
      this.subrutines += "my $" + param.name + "= shift @_;" + endline;
    }
    
    for (const line of node.data.perl) {
      this.subrutines += line + endline;
    }

    this.subrutines += "}";

  }

  // create_template (uncomment) {

  //   const resources = require ('resources');
    
  //   resources.readFile ('./repository/script_resources/script_resources.json', 'utf8', (err, jsonString) => {
  //     if (err) {
  //         console.log("Error reading file from disk:", err)
  //         return
  //     }
  //     try {
  //       const resource_content = JSON.parse(jsonString);

  //       for (const line in resource_content.header) {
  //         this.header += line + "\n";
  //       }

  //       this.end = resource_content.end;

  //   } catch(err) {
  //     console.log('Error parsing JSON string:', err)
  //   }
  // });

  // }


  export () {

    this.control_flow.forEach (node => {
      // Create Subrutines for the control flow 
      this.write_subrutines (node);
      // Create main line of code
      this.write_main (node);      
    });
 
    return this.header +
           this.init + 
           this.main + 
           this.end +
           this.subrutines;
  }

}


$('#export').click (async function(event) {
  let exporter = new Exporter (editor.nodes);
  let script = exporter.export ();
  console.log (script);
});

// window.onload = function () {

//   document.getElementById("export").addEventListener("click", function() {
//     alert("Export");
//     console.log("Megnyomtuk az exportot");

//     var myNum = 100;
//     var myNode = editor.nodes;

//     console.log (myNode[0].id);

//     console.log("fun times");

//     console.log (editor.toJSON());

//     // Ideiglenes export
//     // var myJSON = JSON.stringify(editor.toJSON());
//     // document.getElementById("asd").innerHTML = myJSON;

//   });

// }


// start 

// // Variable type node's output
// my @node1_string = "fdsaafadfsd";

// //OpenFile - param node1-tol ami string
// _node2_name(node1_string)

// my @node35_x = 1;
// my @node35_y = 1;
// my @node35_z = 1;

// _node3_name(node35_x, node35_y, node35_z)

// end

// sub
//  ...