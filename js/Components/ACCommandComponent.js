var VueACCommandControl = {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `
    <div>
      <label :value="value"></label><br>
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
    node.addControl(new ACCommandControl(this.editor, 'command' + node.id));

    let voidInput = new Rete.Input ('void',"Void", voidSocket);
    node.addInput (voidInput);
    var voidOutput = new Rete.Output ('void', "Void", voidSocket);
    node.addOutput (voidOutput);
}

worker(node, inputs, outputs) {
    
}
}