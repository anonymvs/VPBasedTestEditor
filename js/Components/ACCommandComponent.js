var VueACCommandControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `
    <div>
      <label class="ac_command_label" @click="init_label($event)"></label><br>
      <button class="btn btn-secondary btn-lg margin" @click="click($event)">Choose command</button>
    </div>`,

  data() {
    return {
      value: this.value,
    }
  },
  methods: {
    // I HATE MYSELF
    // see rant in open files event handler in component.js
    init_label(e) {
      if (typeof this.value !== 'undefined')
        e.target.innerHTML = this.value;
    },
    click (e) {
       $("#myTable tr").click(function(){
          $(this).addClass('selected').siblings().removeClass('selected');  
          selected = $(this).find('td:first').html();
      });
      
      this.label = e.target.parentElement.firstElementChild;
      this.dirty = true;

      $("#choose_command").click(this.chosen);
      $('#acCommandModal').on('hidden.bs.modal', this.update);
      $('#acCommandModal').modal('toggle');
    },
    chosen () {
      if (this.dirty) {
        let selected = $('#myTable tr.selected').find('td:first').html();
        this.value = selected;
        this.label.innerHTML = selected;
      }
    },
    update() {
      this.dirty = false;
      if (this.ikey)
        this.putData(this.ikey, this.value);
      this.emitter.trigger('process');
    },
    find_elem (e) {
      this.label = e.target;
      this.label.innerHTML = this.value;
    },
    init (data) {
      this.value = data['command']; 
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  },
  
}

class ACCommandControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.render = 'vue';
    this.component = VueACCommandControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class ACCommandComponent extends Rete.Component {
  constructor(){
      super('ACCommand');
  }  

  builder(node) { 
    let control = new ACCommandControl(this.editor, 'command')
    node.addControl(control);

    if (node.data && Object.keys(node.data).length !== 0) {
      control.component.methods.init (node.data);
    }

    let voidInput = new Rete.Input ('void',"", voidSocket);
    node.addInput (voidInput);
    var voidOutput = new Rete.Output ('void', "", voidSocket);
    node.addOutput (voidOutput);
}

worker(node, inputs, outputs) {
    
}
}