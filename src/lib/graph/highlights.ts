// Function to highlight specific edges
export function highlightEdges(edges: cytoscape.EdgeSingular[]) {
	edges.forEach((edge) => edge.addClass('highlighted'));
}

export function highlightT1Edges(edges: cytoscape.EdgeSingular[]) {
	edges.forEach((edge) => edge.addClass('highlighted-Traffic1'));
}

export function highlightT2Edges(edges: cytoscape.EdgeSingular[]) {
	edges.forEach((edge) => edge.addClass('highlighted-Traffic2'));
}

export function clearHighlights(cy: cytoscape.Core) {
	cy.edges().removeClass('highlighted');
}
