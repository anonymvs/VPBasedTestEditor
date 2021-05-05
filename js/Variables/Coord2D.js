var coord2DSocket = new Rete.Socket('coord2D');

class Coord2DComponent extends Rete.Component {

    constructor(){
        super("Coordinate2D");
    }

    builder(node) {
        var out = new Rete.Output('coord2D', "Coord2D", coord2DSocket);

        return node
                .addControl(new NumControl(this.editor, 'coordX'))
                .addControl(new NumControl(this.editor, 'coordY'))
                .addOutput(out);
    }

    worker(node, inputs, outputs) {
        var coordinate = {
            x : node.data.coordX,
            y : node.data.coordY
        };
        
        outputs['coord2D'] = coordinate;
    }
}