class BeginComponent extends Rete.Component {
    constructor(){
        super("Begin");
    }

    builder(node) {
        var voidOutput = new Rete.Output ('void', "Void", voidSocket);
        node.addOutput (voidOutput);
    }

    worker(node, inputs, outputs) {
    }
}