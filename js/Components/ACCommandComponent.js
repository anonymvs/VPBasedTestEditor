var VueACCommandControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  //template: '<input type="button" :readonly="readonly" :value="value" @input="change($event)" @click="click()" />',
  // template: '<button type="button" class="btn btn-secondary btn-lg margin" :readonly="readonly" :value="value" @input="change($event)" data-toggle="modal" data-target="#acCommandModal">Choose command</button>',
  template: `
    <div>
      <label :value="value">test</label><br>
      <button class="btn btn-secondary btn-lg margin" :readonly="readonly" @click="click($event)">Choose command</button>
    </div>`,

  data() {
    return {
      value: "",
    }
  },
  methods: {
    click (e) {
       $("#myTable tr").click(function(){
          $(this).addClass('selected').siblings().removeClass('selected');  
      });

      $("#choose_command").click(this.chosen);

      $('#acCommandModal').on('hidden.bs.modal', this.update);

      $('#acCommandModal').modal('toggle');

      this.label = e.target.parentElement.firstElementChild;
    },
    chosen (label) {
      let selected = $("#myTable tr.selected").find('td:first').html();
      this.value = selected;
      this.label.innerHTML = selected;
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
    node.addControl(new ACCommandControl(this.editor, 'command'));

    let voidInput = new Rete.Input ('void',"Void", voidSocket);
    node.addInput (voidInput);
    var voidOutput = new Rete.Output ('void', "Void", voidSocket);
    node.addOutput (voidOutput);
}

worker(node, inputs, outputs) {
    
}
}