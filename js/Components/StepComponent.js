class StepComponent extends Rete.Component {
  constructor(name){
    super("Step");
  }

  builder(node) {
      // var node.data['save'];
      // var node.data['perl'];

      node.addControl(new StrControl(this.editor, 'str'));

      let voidInput = new Rete.Input ('void',"Void", voidSocket);
      node.addInput (voidInput);
      var voidOutput = new Rete.Output ('void', "Void", voidSocket);
      node.addOutput (voidOutput);
  }

  worker(node, inputs, outputs) {
  }
}