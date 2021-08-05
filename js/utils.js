function getRetePosition () {
    let transformationElem = document.querySelector ('.node-editor').childNodes[0];

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
    var reteElem = document.querySelectorAll ('#rete')[0];

    let width = parseInt (reteElem.offsetWidth);
    let height = parseInt (reteElem.offsetHeight);

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


function selectNode (node, clear = true) {
    if (clear)
        editor.selected.clear ();
    editor.selected.list.push (node);
    editor.nodes.map(n => n.update());
}


document.addEventListener('keydown', function(event) {
    if($(event.target).is('input'))
        return;

    if (event.key === 'Delete') {
        deleteComponent ();
    }
});


// $('#debug_component').click (async function (event) {
//     let comp;
//     try {
//         comp = editor.getComponent ('ProblemSolved');
//     } catch (e) {
//         comp = new SimpleComponent ('ProblemSolved');

//         editor.register (comp);
//         engine.register (comp);
//     } 

//     let node = await comp.createNode(
//     {
//         "name": "BitmapCheck",
//         "description" : "BitmapChecks a given view (view) giving it a name (bitmap_name)",
//         "data_guid" : "{CF29651C-B328-444D-A527-BE47DB0A32FF}",
//         "input" : [
//             {
//                 "name" : "view",
//                 "type" : "string"
//             },
            
//             {
//                 "name" : "bitmap_name",
//                 "type" : "string"
//             }
//         ],
//         "perl" :  [
//             "bitmapCheck (bitmap_name, view);"
//         ]
//     }
//     );

//     node.position = getPosition (184, 195);
 
//     editor.addNode(node);
//     selectNode (node);
// });






