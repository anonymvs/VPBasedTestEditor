var VueOpenStepControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: '<button class="btn btn-secondary btn-lg margin" @click="change($event)">Expand</button>',
  data() {
    return {
      value: "",
    }
  },
  methods: {
    change(e){
      this.emitter.trigger ('myevent');
      //this.update();
    },
    update() {
      // if (this.ikey)
      //   this.putData(this.ikey, this.value)
      // this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}

class StepOpenButtonControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueOpenStepControl;
    this.props = { emitter, ikey: key, readonly };
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
      node.addControl(new StepOpenButtonControl(this.editor, 'step_open'));

      let voidInput = new Rete.Input ('void',"Void", voidSocket);
      node.addInput (voidInput);
      var voidOutput = new Rete.Output ('void', "Void", voidSocket);
      node.addOutput (voidOutput);
  }

  worker(node, inputs, outputs) {
  }
}