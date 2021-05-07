// true ha van mind a ketto, kulonben false
function hasBeginAndEndNode (nodes) {
    let start = nodes.find (node => node.name === 'Begin');
    let end = nodes.find (node => node.name === 'End');

    return ((start ? true : false) && (end ? true : false))
}

// true, ha egy node inputjai es outputjai is kapcsolodnak (amennyiben van neki mind a ketto)
function areAllNodesConnected () {
    let areConnected = true;
    editor.nodes.forEach((e) => {
        let inputs = e.inputs;
        let outputs = e.outputs;
        
        inputs.forEach((c) => {
            if (c.connections.length === 0) {
                areConnected =  false;
            }
        })

        outputs.forEach((c) => {
            if (c.connections.length === 0) {
                areConnected =  false;
            }
        })
    }) 
    return areConnected;
}