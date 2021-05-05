class EndComponent extends Rete.Component {
    constructor(){
        super("End");
    }

    builder(node) {
        let voidInput = new Rete.Input ('void',"Void", voidSocket);
        node.addInput (voidInput);
    }

    worker(node, inputs, outputs) {
        
    }
}