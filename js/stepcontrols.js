
// step expand ========================================================================================================

editor.on ('expand_step', async (id) => {
  
  for (let node of editor.nodes) {
      if (node.id === id) {
          let json = node.data['save'];
          let step_name = node.data['str'];

          state.editor_reference = await editor.toJSON ();

          await editor.clear ();
          await editor.fromJSON (json);

          let container = document.querySelector('#rete');
          container.style.cssText += `
          border-style: solid;
          border-color: yellow;
          border-width: 10px;`;

          let step_view_controls = document.querySelector('#step_view_controls');
          step_view_controls.hidden = false;
          let attr = document.createAttribute("step_id");      
          attr.value = id;                           
          step_view_controls.setAttributeNode(attr);  

          let step_name_label = document.querySelector('#open_step_name');
          step_name_label.innerHTML = step_name;

      }
  }
});


var exit_step_button = document.querySelector ('#exit_step_button');
exit_step_button.addEventListener ('click', async function () {
  
  let step_json = await editor.toJSON (); 

  await editor.clear ();
  await editor.fromJSON (state.editor_reference);

  let step_view_controls = document.querySelector('#step_view_controls');
  step_view_controls.hidden = true;
  let attr = step_view_controls.getAttribute ('step_id');

  for (let node of editor.nodes) {
    if (node.id == attr) {
      node.data['save'] = step_json;
    }
  }

  let container = document.querySelector('#rete');
  container.style.cssText += `
  border-style: solid;
  border-color: yellow;
  border-width: 0px;`;

});


// ====================================================================================================================

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
  let maxId = Rete.Node.latestId + 1;

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

var create_step_from_selected_btn = document.querySelector ('#create_step_from_selected_btn');
create_step_from_selected_btn.addEventListener ('click', function () {
  // var selected = editor.selected;
  // console.log(selected);
});

// ====================================================================================================================

var collapse_steps_btn = document.querySelector ('#collapse_steps_btn');
collapse_steps_btn.addEventListener ('click', function () {

});

// ====================================================================================================================

var collapse_selected_steps_btn = document.querySelector ('#collapse_selected_steps_btn');
collapse_selected_steps_btn.addEventListener ('click', function () {

});

// ====================================================================================================================
