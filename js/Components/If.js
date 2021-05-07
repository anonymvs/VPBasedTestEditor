class If extends Rete.Component {
    constructor(){
        super("If");
    }

    builder(node) {
        let condInput = new Rete.Input ('bool',"Bool", boolSocket);
        let voidInput = new Rete.Input ('void',"Void", voidSocket);
        node.addInput (condInput);
        node.addInput (voidInput);

        let trueOutput = new Rete.Output ('true',"True", voidSocket);
        let falseOutput = new Rete.Output ('false',"False", voidSocket);
        node.addOutput (trueOutput);
        node.addOutput (falseOutput);
    }

    worker(node, inputs, outputs) {
        
    }
}


class EndIf extends Rete.Component {
    constructor(){
        super("EndIf");
    }

    builder(node) {
        let trueInput = new Rete.Input ('true',"Void", voidSocket);
        let falseInput = new Rete.Input ('false',"Void", voidSocket);
        node.addInput (trueInput);
        node.addInput (falseInput);

        let voidOutput = new Rete.Output ('void',"Void", voidSocket);
        node.addOutput (voidOutput);
    }

    worker(node, inputs, outputs) {
        
    }
}