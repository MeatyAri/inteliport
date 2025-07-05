export const tools = [
	{
		type: 'function',
		function: {
			name: 'get_mst',
			strict: true,
			description: 'Get the minimum spanning tree for the graph.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'center_graph',
			strict: true,
			description: 'Center the graph on screen.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'clear_highlights',
			strict: true,
			description: 'Clear all highlights from the graph.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'check_all_pairs_two_hop_reachability',
			strict: true,
			description: 'Check if all nodes are reachable within two hops.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'run_dijkstra',
			strict: true,
			description: "Run Dijkstra's algorithm on the graph.",
			parameters: {
				type: 'object',
				properties: {
					source: {
						type: 'string',
						description: 'The source node to start the algorithm from.'
					},
					target: {
						type: 'string',
						description: 'The target node to find the shortest path to.'
					}
				}
			}
		}
	}
];
