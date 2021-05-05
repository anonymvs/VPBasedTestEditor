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

    let position = [reciprocalZoom * -transform.x + reciprocalZoom * size.width / 2 - zoom * nodeWidth, reciprocalZoom * -transform.y + reciprocalZoom * size.height / 2 - zoom * nodeHeight];

    return position;
}


$('.component').click (async function(event) {
    var id = $(event.target).attr ('componentid');

    var node = await components[id].createNode();

    node.position = getPosition (111, 65);

    editor.addNode(node);
});
