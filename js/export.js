
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
  }


  select_control_flow () {
    let ret = [];

    let start = nodes.find (node => node.name === 'start');
    let end = nodes.find (node => node.name === 'end');

    if (typeof start !== 'undefined' && typeof end !== 'undefined') {

      let current = start;
      while (current === end) {
        for (let key of current.outputs.keys()) {

          if (key === 'control') {  // type key of socket e.i.: 'str'
            current = current.outputs.get (key).node;
            if (current.name !== 'end')
              ret.add (current);

            break;

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


  process_input (signature, key, id, data) {
    let str = ''; 
    let value;
    let variables = [];
    switch (key) {
      case 'control':
        alert ('This is not supposed to be here.');
        break;

      case 'num':
        value = data['num'];
        variables.add (signature);
        str += 'my @' + signature + ' = ' + String (value) + ';';
        break;

      case 'str':
        value = data['str'];
        variables.add (signature);
        str += 'my @' + signature + ' = ' + String (value) + ';';
        break;

      // TODO: rework this... this is horrible maybe functions idunno
      case 'coord2D': {
        let x = data['coordX'];
        let signature_x = signature + '_x';
        str += 'my @' + signature_x + ' = ' + String (x) + ';';
        variables.add (signature_x);

        let y = data['coordY'];
        let signature_y = signature + '_y';
        str += 'my @' + signature_y + ' = ' + String (y) + ';';
        variables.add (signature_y);

        break;
      }
      case 'coord3D': {
        let x = data['coordX'];
        let signature_x = signature + '_x';
        str += 'my @' + signature_x + ' = ' + String (x) + ';';
        variables.add (signature_x);

        let y = data['coordY'];
        let signature_y = signature + '_y';
        str += 'my @' + signature_y + ' = ' + String (y) + ';';
        variables.add (signature_y);

        let z = data['coordZ'];
        let signature_z = signature + '_z';
        str += 'my @' + signature_z + ' = ' + String (z) + ';';
        variables.add (signature_z);
        break;
      }
    }

    this.processed_inputs.set (id, variables);

    return str;
  }


  write_main (node) {

    for (let [key, value] of node.inputs) {
      if (key === 'control')
        continue;

      let input_node = value.node;

      // Declaring variables if not processed already
      if (!this.processed_inputs.has (input_node.id)) {
        let input_name = this.get_signature_name (input_node);
        
        // Processes variable name and value, and return the declaration string 
        this.main += process_input (input_name, key, input_node.id, input_node.data);
      }

      let func_name       = this.get_signature_name (node);
      let input_variables = this.processed_inputs.get (input_node.id);

      // function call
      this.main += func_name + ' (';
      for (let i = 0; i < input_variables.size (); ++i) {
        this.main += '@' + input_variables[i];
        if (i < input_variables.size () - 1)
          this.main += ', ';
      }
      this.main += ');';
    }

  }

  write_subrutines (node) {

    this.subrutines = "sub _node" + this.get_signature_name(node) + " {" + "\n";

    for (const param of node.data['inputs']) {
      this.subrutines += "my $" + param.name + "= shift @_; + \n";
    }
    
    for (const line of node.data['perl']) {
      this.subrutines += line + "\n";
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


window.onload = function () {

  document.getElementById("export").addEventListener("click", function() {
    alert("Export");
    console.log("Megnyomtuk az exportot");

    var myNum = 100;
    var myNode = editor.nodes;

    console.log (myNode[0].id);

    console.log("fun times");

    console.log (editor.toJSON());

    // Ideiglenes export
    // var myJSON = JSON.stringify(editor.toJSON());
    // document.getElementById("asd").innerHTML = myJSON;

  });

}


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