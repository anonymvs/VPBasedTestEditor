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


function deleteComponent () {
    if (editor.selected.list.length > 0) {
        editor.removeNode (editor.selected.list[0]);
        selectedNode = null;
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


$('#auto_arrange').click (async function (event) {
    if (editor.selected.list.length == 0) {
        alert ("Please select a node!");
        return;
    }

    editor.trigger('arrange', { node: editor.selected.list[0] });

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
});

$('#fit_window').click (async function (event) {
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
});


$('#new_open').click (async function(event) {

    editor.clear ();

    let active_option = $('.modal-body input:radio:checked').attr ('id');
    state.type = active_option;

    let begin, end;
    try {
        begin = editor.getComponent ('Begin');
        end = editor.getComponent ('End');
    } catch (e) {
        alert ('there is no begin and end component wtf!');
    } 

    let beg_node = await begin.createNode();
    let end_node = await end.createNode();

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
    download (JSON.stringify(json, null, 2), "nice_name", 'text/plain');
});

$("#open").click(function() {
    // creating input on-the-fly
    var input = $(document.createElement("input"));
    input.attr("type", "file");
    input.attr("accept", ".json,.txt");

    input.on ('change', function (event) {
        let files = event.target.files;
        if (files.length == 0) {
            alert ('select only one file');
        }
        
        if (!files[0])
            alert ('Failed to load file');

        var readFile = new FileReader();
        readFile.onload = function(e) { 
            let json = JSON.parse(e.target.result);
            
            editor.fromJSON (json);
        };
        readFile.readAsText(files[0]); 
    });

    // add onchange handler if you wish to get the file :)
    input.trigger("click"); // opening dialog

    // var file = input.attr('files') .files[0];
    // console.log (file);

    return false; // avoiding navigation
});
