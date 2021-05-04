var coord3DSocket = new Rete.Socket('coord3DSocket');

class Coord3DComponent extends Rete.Component {

    constructor(){
        super("Coordinate3D");
    }

    builder(node) {
        var out = new Rete.Output('coord3D', "Coord3D", coord3DSocket);

        return node
                .addControl(new NumControl(this.editor, 'coordX'))
                .addControl(new NumControl(this.editor, 'coordY'))
                .addControl(new NumControl(this.editor, 'coordZ'))
                .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var coordinate = {
            x : node.data.coordX,
            y : node.data.coordY,
            z : node.data.coordZ
        };
        
        outputs['coord3D'] = coordinate;
    }
}