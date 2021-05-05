$('#rete').click (function (e) {
    if(!$(e.target).is('div#rete')){
        return;
    }

    editor.selected.clear ();
    editor.nodes.map(n => n.update())
});