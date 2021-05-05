class SimpleComponent extends Rete.Component {
    constructor(id){
        super(id);
    }

    builder(node) {

        //node.addControl(new NameControl(this.editor, node['data']['name']));
        console.log(this);
        for (var i = 0; i < node['data']['input'].length; i++) {
            let param = node['data']['input'][i];
            switch (param['type']) {
                case 'string':
                    let strParam = new Rete.Input(i,"String", strSocket);
                    node.addInput(strParam);
                    break;
                case 'number':
                    let numParam = new Rete.Input(i,"String", strSocket);
                    node.addInput(numParam);
                    break;
                case 'coord2d':
                    let coord2DParam = new Rete.Input(i,"String", strSocket);
                    node.addInput(coord2DParam);
                    break;
                case 'coord3d':
                    let coord3DParam = new Rete.Input(i,"String", strSocket);
                    node.addInput(coord3DParam);
                    break;
                default:
                    console.log (element);
                    alert ("Unimplemented type");
                }
        }
        let voidInput = new Rete.Input ('void',"Void", voidSocket);
        node.addInput (voidInput);
        var voidOutput = new Rete.Output ('void', "Void", voidSocket);
        node.addOutput (voidOutput);
    }

    worker(node, inputs, outputs) {
        
    }
}