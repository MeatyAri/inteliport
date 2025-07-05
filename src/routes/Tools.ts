import { checkAllPairstwoHopReachability } from '$lib/graph/hop';
import { clearHighlights, highlightEdges } from '$lib/graph/highlights';
import { runKruskal } from '$lib/graph/mst';
import { shared } from '$lib/shared.svelte';
import { runDijkstra } from '$lib/graph/dijkstra';

export async function handleToolCalls(data: any) {
	for (const toolCall of data.tool_calls) {
		if (toolCall.type === 'function') {
			const functionName = toolCall.function.name;
			const functionArgs = JSON.parse(toolCall.function.arguments);

			if (functionName === 'get_mst') {
				// Execute the get_mst function
				if (!shared.graph) {
					alert('No graph loaded');
					return;
				}
				const mst = runKruskal(shared.graph);

				// highlight the MST Path
				clearHighlights(shared.graph);
				highlightEdges(mst);
			} else if (functionName === 'center_graph') {
				if (!shared.graph) {
					alert('No graph loaded');
					return;
				}
				shared.graph.fit();
				shared.graph.center();
			} else if (functionName === 'clear_highlights') {
				if (!shared.graph) {
					alert('No graph loaded');
					return;
				}
				clearHighlights(shared.graph);
			} else if (functionName === 'check_all_pairs_two_hop_reachability') {
				if (!shared.graph) {
					alert('No graph loaded');
					return;
				}
				const result = checkAllPairstwoHopReachability(shared.graph);
				alert(
					result
						? 'All nodes are reachable within two hops.'
						: 'Not all nodes are reachable within two hops.'
				);
			} else if (functionName === 'run_dijkstra') {
				if (!shared.graph) {
					alert('No graph loaded');
					return;
				}
				const { source, target } = functionArgs;
				const dijkstraResult = runDijkstra(shared.graph, source, target);

				if (typeof dijkstraResult === 'string') {
					alert(dijkstraResult);
					return;
				}
				const { edges } = dijkstraResult;

				// highlight the path
				clearHighlights(shared.graph);
				highlightEdges(edges);
			}
		}
	}
}
