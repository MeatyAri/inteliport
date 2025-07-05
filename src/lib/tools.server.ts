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
	},
	{
		type: 'function',
		function: {
			name: 'delete_node',
			strict: true,
			description: 'Delete a node.',
			parameters: {
				type: 'object',
				properties: {
					nodeId: {
						type: 'string',
						description: 'The id of the node to delete.'
					}
				}
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'add_node',
			strict: true,
			description: 'Add a new node to the graph.',
			parameters: {
				type: 'object',
				properties: {
					label: {
						type: 'string',
						description: 'The label of the new node.'
					}
				}
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'add_edge',
			strict: true,
			description: 'Add a new edge to the graph.',
			parameters: {
				type: 'object',
				properties: {
					source: {
						type: 'string',
						description: 'The source node of the new edge.'
					},
					target: {
						type: 'string',
						description: 'The target node of the new edge.'
					},
					weight: {
						type: 'number',
						description: 'The weight of the new edge.'
					}
				}
			}
		}
	}
];
