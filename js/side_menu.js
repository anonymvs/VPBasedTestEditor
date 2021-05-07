const SideMenus = {"Cursor" : 1, "Fit" : 2, "Arrange" : 3, "Number" : 4, "String" : 5, "Coord2d" : 6, "Coord3d" : 7, "if" : 8};
Object.freeze(SideMenus);

let selectedElem = SideMenus.Cursor;

let activeDrag = false;
let mouseDown = {x : 0, y : 0};
let mouseUp = {x : 0, y : 0};


function refreshSideMenu () {
    $('.side-link').removeClass ('active-item');

    $('.side-link[menu-id=' + selectedElem + ']').addClass ('active-item');

    if (isBeingInserted ())
        $('#rete').css ('cursor', 'copy');
    else
        $('#rete').css ('cursor', 'default');
}

function isBeingInserted () {
    let elements = [4, 5, 6, 7, 8];
    return elements.includes (selectedElem);
}


$('.side-link').click (function (event) {
    var menuId = parseInt ($(event.currentTarget).attr ('menu-id'));

    if (!(menuId >= 1 && menuId <= 8))
        return;

    if (menuId == 1 || menuId == 2 || menuId == 3)
        menuId = 1;

    selectedElem = menuId;

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
        case 8:
            id = 8;
            break;
        default:
            return;
    }    

    if (id == 8) {
        var n1 = await components[8].createNode();
        var n2 = await components[9].createNode();

        var position = getDivPositionToCursor (e.pageX, e.pageY, 0, 0);
        var x = position[0];
        var y = position[1];

        n1.position = [x-200, y];
        n2.position = [x+100, y];
        
        editor.addNode(n1);
        editor.addNode(n2);

        selectNode (n1);
        selectNode (n2, false);

        return;
    } else {
        var node = await components[id].createNode();

        node.position = getDivPositionToCursor (e.pageX, e.pageY, 0, 0);

        editor.addNode(node);

        selectNode (node);
    }

    
});

$(document).keydown(function(e){
    if (e.keyCode == 27) {
        selectedElem = 1;
        refreshSideMenu ();

        editor.selected.clear ();
        editor.nodes.map(n => n.update());
    }
});
