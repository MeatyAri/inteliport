// Functions to color specific nodes
export function colorNode(node: cytoscape.NodeSingular, color: string) {
    node.style({
        'background-color': color
    });
}

