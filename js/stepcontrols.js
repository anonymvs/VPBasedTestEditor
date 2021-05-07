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

var create_step_from_selected_btn = document.querySelector ('#create_step_from_selected_btn');
create_step_from_selected_btn.addEventListener ('click', function () {

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
