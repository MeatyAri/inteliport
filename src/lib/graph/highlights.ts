// Function to highlight specific edges
export function highlightEdges(edges: cytoscape.EdgeSingular[]) {
	edges.forEach((edge) => edge.addClass('highlighted'));
}

export function clearHighlights(cy: cytoscape.Core) {
	cy.edges().removeClass('highlighted');
}
