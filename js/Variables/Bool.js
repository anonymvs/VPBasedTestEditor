var boolSocket = new Rete.Socket('bool');

var VueBoolControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `
    <div>
      <input type="checkbox" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop=""/>
      <span class=bool> False</span>
      </div>`,
  data() {
    return {
      value: false,
    }
  },
  methods: {
    change(e){
      this.value = e.target.value;
      this.update();
      this.label = e.target.parentElement.childNodes[2];
      let checked = e.target.checked;
      console.log (e.target.checked);
      this.label.innerHTML = checked ? " True" : " False";
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

class BoolControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueBoolControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class BoolComponent extends Rete.Component {

    constructor(){
        super("Bool");
    }

    builder(node) {
        var out1 = new Rete.Output('bool', "Bool", boolSocket);

        return node.addControl(new BoolControl(this.editor, 'bool')).addOutput(out1);
    }

    worker(node, inputs, outputs) {
        outputs['bool'] = node.data.bool;
    }
}