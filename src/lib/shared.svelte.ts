import cytoscape from 'cytoscape';

export const shared = $state({
	graph: null as cytoscape.Core | null
});
