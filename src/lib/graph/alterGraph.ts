export function addNode(cy: cytoscape.Core, label: string) {
	cy.add({
		data: { id: label.toLowerCase(), label: label },
		position: { x: Math.random() * 400, y: Math.random() * 400 }
	});

	cy.layout({
		name: 'circle',
		radius: 150
	}).run();
	cy.fit();
	cy.center();
}

export function addEdge(cy: cytoscape.Core, source: string, target: string, weight: number) {
	const sourceId = source.toLowerCase();
	const targetId = target.toLowerCase();
	cy.add({
		data: { id: `${sourceId}${targetId}`, source: sourceId, target: targetId, weight: weight }
	});
}

export function deleteNode(cy: cytoscape.Core, nodeId: string): void {
	const node = cy.getElementById(nodeId);
	if (node.length > 0) {
		node.remove();

		cy.layout({
			name: 'circle',
			radius: 150
		}).run();
		cy.fit();
		cy.center();
	} else {
		console.log(`Node with ID ${nodeId} not found.`);
	}
}
