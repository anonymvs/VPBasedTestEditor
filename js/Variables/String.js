var strSocket = new Rete.Socket('string');

var VueStrControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: '<input type="text" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>',
  data() {
    return {
      value: "",
    }
  },
  methods: {
    change(e){
      this.value = e.target.value;
      this.update();
    },
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

class StrControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueStrControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class StrComponent extends Rete.Component {

    constructor(){
        super("String");
    }

    builder(node) {
        var out1 = new Rete.Output('str', "String", strSocket);

        return node.addControl(new StrControl(this.editor, 'str')).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['str'] = node.data.str;
    }
}