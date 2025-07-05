// runs the dijkstra algo and return a list and an integer for its cost
export function runDijkstra(
	cy: cytoscape.Core,
	start: string,
	end: string
): { path: string[]; distance: number; edges: cytoscape.EdgeSingular[] } | string {
	try {
		start = start.toLowerCase();
		end = end.toLowerCase();

		const result = cy.elements().dijkstra({
			root: `#${start}`,
			weight: (edge) => edge.data('weight') || 1 // Default weight of 1 if 'weight' is missing
		});

		const pathTo = result.pathTo(cy.$(`#${end}`));

		if (!pathTo || pathTo.length === 0) {
			return `No path found. ${end} is not reachable from ${start} in the specified graph.`; // No path found
		}

		let path = pathTo.map((ele) => ele.data('id'));
		//path = path.filter(str => str.length === 1);
		const distance = result.distanceTo(cy.$(`#${end}`));

		const edges = getEdgesFromPath(cy, path);

		return { path, distance, edges };
	} catch (error) {
		console.error("Error during Dijkstra's algorithm:", error);
		return String(error); // Return undefined on errors.
	}
}

// Finds edges by their IDs
function findEdgesByIds(cy: cytoscape.Core, edgeIds: string[]): cytoscape.EdgeSingular[] {
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

// Highlight the edges in the path returned by Dijkstra's algorithm
function getEdgesFromPath(cy: cytoscape.Core, path: string[]): cytoscape.EdgeSingular[] {
	path = path.filter((str) => str.length === 2);
	return findEdgesByIds(cy, path);
}
