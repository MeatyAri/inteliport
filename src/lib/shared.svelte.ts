import cytoscape from 'cytoscape';

export const shared = $state({
	graph: null as cytoscape.Core | null,
	prevGraph: null as cytoscape.Core | null
});
