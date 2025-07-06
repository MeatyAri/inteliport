import type cytoscape from "cytoscape";

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
export function deleteEdge(cy: cytoscape.Core, nodeId1: string, nodeId2: string): void {
	const edge = findEdgeByIds(cy, nodeId1, nodeId2);
	if (edge) {
		edge.remove();
	} else {
		console.log("Edge not found.");
	}
}

export function findEdgeByIds(cy: cytoscape.Core, nodeId1: string, nodeId2: string): cytoscape.EdgeSingular | null {
	// Get all edges in the Cytoscape instance
	const edges = cy.edges();

	// Iterate through the edges to find the one that matches the given IDs
	for (const edge of edges) {
		const sourceId = edge.source().id();
		const targetId = edge.target().id();

		// Check if the edge's source and target match the provided edge IDs
		if ((sourceId === nodeId1 && targetId === nodeId2) || (sourceId === nodeId2 && targetId === nodeId1)) {
			return edge; // Return the found edge
		}
	}

	return null; // Return null if no matching edge is found
}

export function findNodeById(cy: cytoscape.Core, nodeId: string): cytoscape.NodeSingular | null {
	// Get all nodes in the Cytoscape instance
	const nodes = cy.nodes();

	// Iterate through the nodes to find the one that matches the given ID
	for (let node of nodes) {
		if (node.id() === nodeId) {
			return node; // Return the found node
		}
	}

	return null; // Return null if no matching node is found
}

export function findEdgesByIds(cy: cytoscape.Core, edgeIds: string[]): cytoscape.EdgeSingular[] {
	const foundEdges: cytoscape.EdgeSingular[] = [];

	edgeIds.forEach((edgeId) => {
		const edge = cy.getElementById(edgeId); // Use getElementById to find edges by ID

		if (edge && edge.isEdge()) {
			// Confirm that the element found is an edge
			foundEdges.push(edge as cytoscape.EdgeSingular);
		}
	});

	return foundEdges;
}
