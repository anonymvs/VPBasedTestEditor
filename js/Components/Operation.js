var anySocket = new Rete.Socket('Any');
// Don't forget to add new socket
numSocket.combineWith(anySocket);
boolSocket.combineWith(anySocket);
strSocket.combineWith(anySocket);
coord2DSocket.combineWith(anySocket);
coord3DSocket.combineWith(anySocket);

var VueOperationControl = {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: `
      <div>
        <select name="Opetation" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop="">
            <option value="equal">=</option>
            <option value="greater">></option>
            <option value="smaller"><</option>
            <option value="notequal">!=</option>
        </select>
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
  
class OperationControl extends Rete.Control {
  
    constructor(emitter, key, readonly) {
      super(key);
      this.component = VueOperationControl;
      this.props = { emitter, ikey: key, readonly };
    }
  
    setValue(val) {
      this.vueContext.value = val;
    }
}

class Operation extends Rete.Component {
    constructor(){
        super("Operation");
    }

    builder(node) {

        console.log(this);
        
        let param1 = new Rete.Input ('any1',"", anySocket);
        node.addInput (param1);
        let param2 = new Rete.Input ('any2',"", anySocket);
        node.addInput (param2);

        node.addControl(new OperationControl(this.editor, 'operation'))

        var boolOutput = new Rete.Output ('bool', "", boolSocket);
        node.addOutput (boolOutput);
    }

    worker(node, inputs, outputs) {
        
    }
}