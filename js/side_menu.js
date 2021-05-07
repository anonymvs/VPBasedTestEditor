const SideMenus = {"Cursor" : 1, "Fit" : 2, "Arrange" : 3, "Number" : 4, "String" : 5, "Coord2d" : 6, "Coord3d" : 7};
Object.freeze(SideMenus);

let selectedElem = SideMenus.Cursor;

let activeDrag = false;
let mouseDown = {x : 0, y : 0};
let mouseUp = {x : 0, y : 0};


function refreshSideMenu () {
    $('.side-link').removeClass ('active-item');

    $('.side-link[menu-id=' + selectedElem + ']').addClass ('active-item');
}

function isBeingInserted () {
    let elements = [4, 5, 6, 7];
    return elements.includes (selectedElem);
}


$('.side-link').click (function (event) {
    var menuId = parseInt ($(event.currentTarget).attr ('menu-id'));

    if (!(menuId >= 1 && menuId <= 7))
        return;

    if (menuId == 1 || menuId == 2 || menuId == 3)
        menuId = 1;

    selectedElem = menuId;

    if (isBeingInserted ())
        $('#rete').css ('cursor', 'copy');
    else
        $('#rete').css ('cursor', 'default');

    refreshSideMenu ();
});


$('#side-fit').click (function (event) {
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
});


$('#side-arrange').click (async function (event) {
    if (editor.selected.list.length == 0) {
        alert ("Please select a node!");
        return;
    }

    editor.trigger('arrange', { node: editor.selected.list[0] });

    editor.view.resize();
    AreaPlugin.zoomAt(editor);
});

$('#rete').mousedown (function (e) {
    mouseDown.x = e.pageX;
    mouseDown.y = e.pageY;
    activeDrag = true;

    console.log ('a');
});

$('#rete').mousemove (function(event) {
    if (!activeDrag)
        return; 
    
    $('#rete').css ('cursor', 'grab');
});

$('#rete').mouseup (function (e) {
    mouseUp.x = e.pageX;
    mouseUp.y = e.pageY;
    activeDrag = false;

    if (isBeingInserted ())
        $('#rete').css ('cursor', 'copy');
    else
        $('#rete').css ('cursor', 'default');
});

$('#rete').click (async function (e) {
    if (!(mouseDown.x == mouseUp.x && mouseDown.y == mouseUp.y))
        return;

    if(!$(e.target).is('div#rete'))
        return;

    let id = 0;

    switch (selectedElem) {
        case 4:
            id = 0;
            break;
        case 5:
            id = 1;
            break;
        case 6:
            id = 2;
            break;
        case 7:
            id = 3;
            break;
        default:
            return;
    }    

    console.log (e.pageX);
    console.log (e.pageY);

    var node = await components[id].createNode();

    node.position = getDivPositionToCursor (e.pageX, e.pageY, 0, 0);

    editor.addNode(node);

    selectNode (node);
});
