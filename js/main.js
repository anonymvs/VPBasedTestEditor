/*
// Commands to array
function getCommands(command_array) {
  let json_database = getData();
  let commands = json_database['nodes'][0];

  for (const [key, value] of Object.entries(commands)) {
    command_array.push([key, value]);
    console.log(`${key}: ${value}`);
  }
}

function getData() {

  const xhr = new XMLHttpRequest();

  xhr.open("GET", "./repository/simple/data_nodes.json", false);
  xhr.send(null);

  const response = JSON.parse(xhr.responseText)
  return response
}

let command_array = []
getCommands(command_array);
*/

(async () => {
    var container = document.querySelector('#rete');
    // var components = [new NumComponent (), new StrComponent (), new Coord2DComponent (), new Coord3DComponent ()];
    
    editor = new Rete.NodeEditor('demo@0.1.0', container);
    editor.use(ConnectionPlugin.default);
    editor.use(VueRenderPlugin.default);    
    // editor.use(ContextMenuPlugin.default);
    // editor.use(AreaPlugin);
    editor.use(MinimapPlugin.default);
    // editor.use(CommentPlugin.default);
    // editor.use(HistoryPlugin);
    // editor.use(ConnectionMasteryPlugin.default);

    engine = new Rete.Engine('demo@0.1.0');
    
    components.map(c => {
        editor.register(c);
        engine.register(c);
    });

    //  let n1 = await components[4].createNode(
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
    //  );
    // let n2 = await components[0].createNode({num: 0});
    // let n3 = await components[0].createNode({num: 0});
    // let add = await components[1].createNode();

    //n1.position = [80, 200];
    // n2.position = [80, 400];
    // n3.position = [80, 600];
    // add.position = [500, 240];
 
    //editor.addNode(n1);
    // editor.addNode(n2);
    // editor.addNode(n3);
    // editor.addNode(add);

    // editor.connect(n1.outputs.get('num'), add.inputs.get('num'));
    // editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));

    editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
      console.log('process');
        await engine.abort();
        await engine.process(editor.toJSON());
    });

    // editor.on('nodeselect', (node) => {
    //   selectedNode = node;
    // });

    // editor.view.resize();
    // AreaPlugin.zoomAt(editor);
    editor.trigger('process');
})();
