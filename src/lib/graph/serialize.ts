import type cytoscape from 'cytoscape';

/**
 * Converts a Cytoscape graph to a human-readable text representation
 * that can be used as context for LLM agents
 */
export function serializeGraph(graph: cytoscape.Core): string {
	if (!graph) {
		return 'No graph is currently loaded.';
	}

	const nodes = graph.nodes();
	const edges = graph.edges();

	let output = 'CURRENT GRAPH STATE:\n\n';

	// Add basic statistics
	output += `Graph Statistics:\n`;
	output += `- Nodes: ${nodes.length}\n`;
	output += `- Edges: ${edges.length}\n\n`;

	// List all nodes
	output += 'Nodes:\n';
	nodes.forEach((node) => {
		const data = node.data();
		output += `- ${data.id}`;
		if (data.label && data.label !== data.id) {
			output += ` (${data.label})`;
		}
		output += '\n';
	});

	output += '\n';

	// List all edges with weights
	output += 'Edges (connections between nodes):\n';
	edges.forEach((edge) => {
		const data = edge.data();
		const weight = data.weight || 1;
		output += `- ${data.source} ↔ ${data.target}`;
		if (weight !== 1) {
			output += ` (weight: ${weight})`;
		}
		if (data.label && data.label !== `${data.source}-${data.target}`) {
			output += ` [${data.label}]`;
		}
		output += '\n';
	});

	// Add adjacency information for better context
	output += '\nAdjacency Information:\n';
	nodes.forEach((node) => {
		const nodeId = node.data('id');
		const connectedEdges = node.connectedEdges();

		output += `- ${nodeId}:\n`;

		if (connectedEdges.length > 0) {
			const connected = connectedEdges
				.map((edge) => {
					const otherNode =
						edge.data('source') === nodeId ? edge.data('target') : edge.data('source');
					const weight = edge.data('weight') || 1;
					return weight !== 1 ? `${otherNode}(${weight})` : otherNode;
				})
				.join(', ');
			output += `  ↔ connected to: ${connected}\n`;
		} else {
			output += `  (isolated node)\n`;
		}
	});

	// Add any highlighted elements
	const highlightedNodes = graph.nodes('.highlighted');
	const highlightedEdges = graph.edges('.highlighted');

	if (highlightedNodes.length > 0 || highlightedEdges.length > 0) {
		output += '\nCurrently Highlighted Elements:\n';

		if (highlightedNodes.length > 0) {
			const highlighted = highlightedNodes.map((node) => node.data('id')).join(', ');
			output += `- Nodes: ${highlighted}\n`;
		}

		if (highlightedEdges.length > 0) {
			const highlighted = highlightedEdges
				.map((edge) => `${edge.data('source')} ↔ ${edge.data('target')}`)
				.join(', ');
			output += `- Edges: ${highlighted}\n`;
		}
	}

	return output;
}

/**
 * Creates a compact representation of the graph for shorter context
 */
export function serializeGraphCompact(graph: cytoscape.Core): string {
	if (!graph) {
		return 'No graph loaded.';
	}

	const nodes = graph.nodes();
	const edges = graph.edges();

	let output = `Graph: ${nodes.length} nodes, ${edges.length} edges\n`;

	// Compact node list
	const nodeIds = nodes.map((node) => node.data('id')).join(', ');
	output += `Nodes: ${nodeIds}\n`;

	// Compact edge list
	const edgeList = edges
		.map((edge) => {
			const data = edge.data();
			const weight = data.weight || 1;
			return weight !== 1
				? `${data.source}↔${data.target}(${weight})`
				: `${data.source}↔${data.target}`;
		})
		.join(', ');
	output += `Edges: ${edgeList}`;

	return output;
}
