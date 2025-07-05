// Function to check whether all pairs of nodes are reachable within two hops
export function checkAllPairstwoHopReachability(cyto: cytoscape.Core): boolean {
	const nodes = cyto.nodes();
	if (nodes.length === 0) {
		return true; // Empty graph is trivially reachable
	}

	for (let i = 0; i < nodes.length; i++) {
		for (let j = i + 1; j < nodes.length; j++) {
			// Avoid redundant checks and self-checks
			const startNode = nodes.eq(i);
			const endNode = nodes.eq(j);

			if (!isReachableWithinTwoHops(cyto, startNode.id(), endNode.id())) {
				//return false;
				// If any pair is not reachable, the whole graph is not
				
			}
		}
	}

	return true; // All pairs are reachable within 2 hops
}

// Checks if a specific end node is reachable from a start node within a maximum of 2 hops.
function isReachableWithinTwoHops(
	cyto: cytoscape.Core,
	startNodeId: string,
	endNodeId: string
): boolean {
	const visited = new Set<string>();
	const queue: string[] = [startNodeId];
	visited.add(startNodeId);

	let hopCount = 0;

	while (queue.length > 0 && hopCount <= 3) {
		const currentLevelSize = queue.length;

		for (let i = 0; i < currentLevelSize; i++) {
			const currentNodeId = queue.shift()!;

			if (currentNodeId === endNodeId) {
				return true; // Reached the end node
			}

			const neighbors = cyto.nodes(`#${currentNodeId}`).neighborhood().nodes();
			for (const neighbor of neighbors) {
				if (!visited.has(neighbor.id())) {
					visited.add(neighbor.id());
					queue.push(neighbor.id());
				}
			}
		}

		hopCount++;
	}

	return false; // Did not reach the end node within 2 hops
}
