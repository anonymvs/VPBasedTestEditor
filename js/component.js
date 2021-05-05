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

    let position = [reciprocalZoom * -transform.x + reciprocalZoom * size.width / 2 - zoom * nodeWidth / 2, reciprocalZoom * -transform.y + reciprocalZoom * size.height / 2 - zoom * nodeHeight / 2];

    return position;
}


function deleteComponent () {
    if (selectedNode != null) {
        editor.removeNode (selectedNode);
        selectedNode = null;
    }
}


$('.component').click (async function(event) {
    var id = $(event.target).attr ('componentid');

    var node = await components[id].createNode();

    node.position = getPosition (222, 131);

    editor.addNode(node);
});


$('#delete').click (function (event) {
    deleteComponent ();
});

$(document).keydown(function(e){
    if (e.keyCode == 46)
        deleteComponent ();
});

$('#debug').click (async function (event) {
    let node = await components[4].createNode(
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
});
