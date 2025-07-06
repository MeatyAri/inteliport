// Functions to color specific nodes
export function colorNode(node: cytoscape.NodeSingular, color: string) {
	node.style({
		'background-color': color
	});
	//console.log(node.style('background-color'));
}
export function resetNodeColor(cy: cytoscape.Core) {
	cy.nodes().forEach((element) => {
		element.style({
			'background-color': '#0074D9' // Default color
		});
	});
}
