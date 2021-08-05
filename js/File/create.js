// Async
function getTemplate(beg_node, end_node, template_type) {

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

var new_open_button = document.querySelector ('#new_open');
new_open_button.addEventListener ('click', async function () {
    editor.clear ();

    let active_option = $('.modal-body input:radio:checked').attr ('id');
    state.type = active_option;

    let begin, end;
    try {
        begin = editor.getComponent ('Begin');
        end   = editor.getComponent ('End');
    } catch (e) {
        alert ('there is no begin and end component wtf!');
    } 

    let beg_node = await begin.createNode();
    let end_node = await end.createNode();

    await getTemplate (beg_node, end_node, active_option)

    let size = getReteSize (); 
    let offset = size.width / 6;
    beg_node.position = [offset,     size.height / 2];
    end_node.position = [offset * 4, size.height / 2];

    editor.addNode(beg_node);
    editor.addNode(end_node);
    
    editor.trigger('process');

    let step_view_controls = document.querySelector('#step_view_controls');
    step_view_controls.hidden = true;
});

// Open file ==========================================================================================================

function register_simple_component (node) {
    try {
        editor.getComponent (node.name);
    } catch (e) {
        let comp = new SimpleComponent (node.name);
  
        editor.register (comp);
        engine.register (comp);
    } 
}


var open_button = document.querySelector ('#open');
open_button.addEventListener ('click', async function () {
    // creating input on-the-fly
    var input = $(document.createElement("input"));
    input.attr("type", "file");
    input.attr("accept", ".json,.txt");

    input.on ('change', function (event) {
        let files = event.target.files;
        if (files.length == 0) 
            alert ('select only one file');        
        
        if (!files[0])
            alert ('Failed to load file');

        var readFile = new FileReader();
        readFile.onload = function(e) { 
            let json = JSON.parse(e.target.result);
            Object.entries(json['nodes']).forEach((entry) => {
                const [key, value] = entry;

                register_simple_component (value);
            });
            
            editor.fromJSON (json);
            setTimeout(function() {
                $('.ac_command_label').trigger('click');
            }, 100);
        };
        readFile.readAsText(files[0]); 
    });

    // add onchange handler if you wish to get the file :)
    input.trigger("click"); // opening dialog

    let step_view_controls = document.querySelector('#step_view_controls');
    step_view_controls.hidden = true;

    return false; // avoiding navigation
});

// ====================================================================================================================
// Imprt ==============================================================================================================

var import_btn = document.querySelector ('#import');
import_btn.addEventListener ('click', function () {
    // creating input on-the-fly
    var input = $(document.createElement("input"));
    input.attr("type", "file");
    input.attr("accept", ".json,.txt");

    input.on ('change', function (event) {
        let files = event.target.files;
        if (files.length == 0) 
            alert ('select only one file');        
        
        if (!files[0])
            alert ('Failed to load file');

        var readFile = new FileReader();
        readFile.onload = function(e) { 
            let json = JSON.parse(e.target.result);
            Object.entries(json['nodes']).forEach((entry) => {
                const [key, value] = entry;

                register_simple_component (value);
            });
            
            //editor.fromJSON (json);
            manual_import (editor, json);
            
            setTimeout(function() {
                $('.ac_command_label').trigger('click');
            }, 100);
        };
        readFile.readAsText(files[0]); 
    });

    // add onchange handler if you wish to get the file :)
    input.trigger("click"); // opening dialog
});

// ====================================================================================================================
