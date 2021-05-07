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
    this.beg_node = nodes.find (node => node.name === 'Begin');
    this.end_node = nodes.find (node => node.name === 'End');

    this.export = this.export.bind (this);
  }


  select_control_flow (nodes) {
    let ret = [];

    let start = nodes.find (node => node.name === 'Begin');
    let end = nodes.find (node => node.name === 'End');

    if (typeof start !== 'undefined' && typeof end !== 'undefined') {

      let current = start;
      while (current !== end) {
        for (let key of current.outputs.keys()) {

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
      case 'Coordinate2D': {
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
      case 'Coordinate3D': {
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
      if (key === 'void')
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
      }
    }

    let input_variables = [];

    for (let [key, value] of node.inputs) {
      if (key === 'void')
        continue;

      let input_node;
      let connections = value.connections;
      if (typeof connections !== 'undefined') {
        input_node = connections[0].output.node;  
      }      

      // Declaring variables if not processed already
      if (this.processed_inputs.has (input_node.id)) {  
        // Processes variable name and value, and return the declaration string 
        for (let value of this.processed_inputs.get (input_node.id)) {
          input_variables.push (value);
        }
      }
    }

    let func_name = this.get_signature_name (node);

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

    this.subrutines += "sub _" + this.get_signature_name(node) + " {" + endline;

    if (node.name === "ACCommand") {
      this.subrutines += node.name + "(" + node.data.command + ");" + endline;
    }

    if (typeof node.data.input !== 'undefined' && typeof node.data.perl !== 'undefined') {
      for (const param of node.data.input) {
        if (param.type === 'coord2d') {
          this.subrutines += "my $" + param.name + "_x = shift @_;" + endline;
          this.subrutines += "my $" + param.name + "_y = shift @_;" + endline;
        } else if (param.type === 'coord3d') {
          this.subrutines += "my $" + param.name + "_x = shift @_;" + endline;
          this.subrutines += "my $" + param.name + "_y = shift @_;" + endline;
          this.subrutines += "my $" + param.name + "_z = shift @_;" + endline;
        } else {
          this.subrutines += "my $" + param.name + " = shift @_;" + endline;
        }
      }
      
      for (const line of node.data.perl) {
        this.subrutines += line + endline;
      }
    }

    this.subrutines += "}" + endline + endline;

  }

  write_beg () {
    if (this.beg_node.type === 'undefined') {
      return;
    }
    
    for (const line of this.beg_node.data.perl) {
      this.init += line + endline;
    }
  }

  write_end () {
    if (this.end_node.type === 'undefined') {
      return;
    }
    
    for (const line of this.end_node.data.perl) {
      this.end += line + endline;
    }
  }

  downloadToFile (content, filename, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(a.href);
  };

  export () {

    this.write_beg ();

    this.control_flow.forEach (node => {
      // Create Subrutines for the control flow 
      this.write_subrutines (node);
      // Create main line of code
      this.write_main (node);      
    });

    this.write_end ()

    content = this.header +
              this.init + endline +
              this.main + endline +
              this.end + endline +
              this.subrutines;
              
    return content;
  }

}


$('#export').click (async function(event) {
  let exporter = new Exporter (editor.nodes);
  let script = exporter.export ();

  this.downloadToFile (script, "script.pl", "text/plain");
});