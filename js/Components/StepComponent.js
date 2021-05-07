var VueOpenStepControl = {
  props: ['readonly', 'emitter', 'ikey', 'iid', 'getData', 'putData'],
  template: '<button class="btn btn-secondary btn-lg margin" @click="change($event)">Expand</button>',
  data() {
    return {
      value: 'undefined',
    }
  },
  methods: {
    change(e){      
      this.update();
    },
    update() {
      if (this.ikey)
        this.putData(this.ikey, this.value)
      //this.emitter.trigger('process');
      this.emitter.trigger ('myevent', this.iid);
    },
    init (id) {
      this.value = id;
    }

  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}

class StepOpenButtonControl extends Rete.Control {

  constructor(emitter, key, id, readonly) {
    super(key);
    this.component = VueOpenStepControl;
    this.props = { emitter, ikey: key, iid: id, readonly };
    this.component.methods.init (id);
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class StepComponent extends Rete.Component {
  constructor(name){
    super("Step");
  }

  builder(node) {
      // var node.data['save'];
      // var node.data['perl'];      

      node.addControl(new StrControl(this.editor, 'str'));
      node.addControl(new StepOpenButtonControl(this.editor, 'step', node.id));

      let voidInput = new Rete.Input ('void',"", voidSocket);
      node.addInput (voidInput);
      var voidOutput = new Rete.Output ('void', "", voidSocket);
      node.addOutput (voidOutput);
  }

  worker(node, inputs, outputs) {
  }
}