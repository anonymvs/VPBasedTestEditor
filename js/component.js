function getRetePosition () {
    let transformationElem = $('.node-editor').children ().first ();

    console.log ("transformation");
    console.log (transformationElem.css('transform'));
    console.log (transformationElem.css('transform').split(','));

    let zoom = parseFloat(transformationElem.css('transform').split(',')[3]);
    let xCoord = parseInt(transformationElem.css('transform').split(',')[4]);
    let yCoord = parseInt(transformationElem.css('transform').split(',')[5]);

    return {
        zoom : zoom,
        x : xCoord,
        y : yCoord
    }
}


function getReteSize () {
    var reteElem = $('#rete');

    let width = parseInt (reteElem.css ('width'));
    let height = parseInt (reteElem.css ('height'));

    return {
        width : width,
        height : height
    };
}


function getPosition (nodeWidth, nodeHeight) {
    let transform = getRetePosition (); 
    let size = getReteSize (); 

    let zoom = transform.zoom;
    let reciprocalZoom = 1.0 / transform.zoom;

    let positionX = reciprocalZoom * -transform.x + reciprocalZoom * size.width / 2 - zoom * nodeWidth / 2;
    let positionY = reciprocalZoom * -transform.y + reciprocalZoom * size.height / 2 - zoom * nodeHeight / 2;

    let position = [positionX, positionY];

    return position;
}

// TODO
function getDivPositionToCursor (screenX, screenY, nodeWidth, nodeHeight) {
    let transform = getRetePosition ();

    let zoom = transform.zoom;
    let reciprocalZoom = 1.0 / transform.zoom;

    let positionX = reciprocalZoom * -transform.x + reciprocalZoom * screenX - zoom * nodeWidth / 2;
    let positionY = reciprocalZoom * -transform.y + reciprocalZoom * screenY - zoom * nodeHeight / 2;

    let position = [positionX, positionY];

    return position;
}


function deleteComponent () {
    for (node of editor.selected.list) {
        editor.removeNode (node);
    }
}


function selectNode (node) {
    editor.selected.clear ();
    editor.selected.list.push (node);
    editor.nodes.map(n => n.update());
}


$('#delete').click (function (event) {
    deleteComponent ();
});


$(document).keydown(function(e){
    if($(e.target).is('input'))
        return;

    if (e.keyCode == 46)
        deleteComponent ();
});


$('.component').click (async function(event) {
    var id = $(event.target).attr ('componentid');

    if (id == null)
        return;

    var node = await components[id].createNode();

    node.position = getPosition (222, 131);

    editor.addNode(node);

    selectNode (node);
});


$('#debug_component').click (async function (event) {
    let comp;
    try {
        comp = editor.getComponent ('ProblemSolved');
    } catch (e) {
        comp = new SimpleComponent ('ProblemSolved');

        editor.register (comp);
        engine.register (comp);
    } 

    let node = await comp.createNode(
    {
        "name": "BitmapCheck",
        "description" : "BitmapChecks a given view (view) giving it a name (bitmap_name)",
        "data_guid" : "{CF29651C-B328-444D-A527-BE47DB0A32FF}",
        "input" : [
            {
                "name" : "view",
                "type" : "string"
            },
            
            {
                "name" : "bitmap_name",
                "type" : "string"
            }
        ],
        "perl" :  [
            "bitmapCheck (bitmap_name, view);"
        ]
    }
    );

    node.position = getPosition (184, 195);
 
    editor.addNode(node);
    selectNode (node);
});



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


$('#new_open').click (async function(event) {

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
});

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

$('#save').click (async function(event) {
    var json = editor.toJSON();
    download (JSON.stringify(json, null, 2), "nice_name", '.json');
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


$("#open").click(function() {
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
    

    return false; // avoiding navigation
});

// ====================================================================================================================

// Imprt ==============================================================================================================


var create_step_button = document.querySelector ('#import');
create_step_button.addEventListener ('click', function () {
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

// Create Step ========================================================================================================

function get_step_component () {
    try {
        return editor.getComponent ('Step');
    } catch (e) {
        let comp = new StepComponent ();
  
        editor.register (comp);
        engine.register (comp);

        return comp;
    } 
}

var create_step_button = document.querySelector ('#create_step_btn');
create_step_button.addEventListener ('click', function () {
    let maxId = 0;
    for (let node of editor.nodes) {
        maxId = Math.max(node.id, maxId);
    }

    maxId++;

    for (let node of editor.nodes) {
        node.data['step'] = maxId;
    }
    var save = editor.toJSON ();

    let exporter = new Exporter (editor.nodes);
    let script = exporter.export ();
    
    let data = {
        'save' : save,
        'perl' : script
    }

    editor.clear ();

    (async(m) => {     
        let comp = get_step_component ();
        let node = await comp.createNode (data);
        node.position = getPosition (222, 131);

        if (m !== node.id)
            alert ('nem egyenlo');

        editor.addNode(node);
        selectNode (node);
    })(maxId);
});

// ====================================================================================================================

// var create_step_button = document.querySelector ('#create_step_from_selected_btn');
// create_step_button.addEventListener ('click', function () {

// });

