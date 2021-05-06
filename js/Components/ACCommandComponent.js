var data = []

var VueACCommandControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: '<input type="button" :readonly="readonly" :value="value" @input="change($event)" @click="click()" />',
  // template: '<button type="button" class="btn btn-secondary btn-lg margin" :readonly="readonly" :value="value" @input="change($event)" data-toggle="modal" data-target="#acCommandModal">Choose command</button>',
  template: '<button class="btn btn-secondary btn-lg margin" :readonly="readonly" @click="click()">Choose command</button>',
  data() {
    return {
      value: "",
    }
  },
  methods: {
    click () {
      $('#acCommandModal').modal('toggle');

    },
    // change(e){

    //   this.value = e.target.value;
    //   this.update();
    // },
    update() {
      if (this.ikey)
        this.putData(this.ikey, this.value)
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}

$('#ac_command_table').bootstrapTable({
  data: data
});

class ACCommandControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
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
    node.addControl(new ACCommandControl(this.editor, 'command', false));

    let voidInput = new Rete.Input ('void',"Void", voidSocket);
    node.addInput (voidInput);
    var voidOutput = new Rete.Output ('void', "Void", voidSocket);
    node.addOutput (voidOutput);
}

worker(node, inputs, outputs) {
    
}
}