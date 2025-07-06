export const tools = [
	{
		type: 'function',
		function: {
			name: 'get_mst',
			strict: true,
			description:
				"Calculate and display the minimum spanning tree (MST) for the graph using Kruskal's algorithm."
		}
	},
	{
		type: 'function',
		function: {
			name: 'center_graph',
			strict: true,
			description: 'Center the graph visualization on the screen.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'clear_highlights',
			strict: true,
			description: 'Remove all highlights from the graph visualization.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'check_all_pairs_two_hop_reachability',
			strict: true,
			description:
				'Verify if all nodes in the graph are reachable within two hops using BFS reachability analysis.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'run_dijkstra',
			strict: true,
			description:
				"Execute Dijkstra's algorithm to find the shortest path from a source node to a target node.",
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
				},
				required: ['source', 'target']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'plan_trip',
			strict: true,
			description:
				'Plan a trip from a source node to a target node, providing details including start time, duration, and path.',
			parameters: {
				type: 'object',
				properties: {
					source: {
						type: 'string',
						description: 'The source node to start the trip from.'
					},
					target: {
						type: 'string',
						description: 'The target node to end the trip at.'
					},
					duration: {
						type: 'number',
						description:
							'The duration of the trip in seconds (optional, defaults to distance * 10).'
					}
				},
				required: ['source', 'target']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'start_trip',
			strict: true,
			description: 'Initiate a previously planned trip using its trip ID.',
			parameters: {
				type: 'object',
				properties: {
					tripId: {
						type: 'string',
						description: 'The ID of the trip to start.'
					}
				},
				required: ['tripId']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'delete_node',
			strict: true,
			description: 'Remove a node from the graph.',
			parameters: {
				type: 'object',
				properties: {
					nodeId: {
						type: 'string',
						description: 'The ID of the node to delete.'
					}
				},
				required: ['nodeId']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'add_node',
			strict: true,
			description: 'Add a new node to the graph with a specified label.',
			parameters: {
				type: 'object',
				properties: {
					label: {
						type: 'string',
						description: 'The label of the new node.'
					}
				},
				required: ['label']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'add_edge',
			strict: true,
			description: 'Add a new edge to the graph between two specified nodes with a given weight.',
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
				},
				required: ['source', 'target', 'weight']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'delete_edge',
			strict: true,
			description: 'Remove an edge from the graph between two specified nodes.',
			parameters: {
				type: 'object',
				properties: {
					nodeId1: {
						type: 'string',
						description: 'The ID of the first node of the edge.'
					},
					nodeId2: {
						type: 'string',
						description: 'The ID of the second node of the edge.'
					}
				},
				required: ['nodeId1', 'nodeId2']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'color_node',
			strict: true,
			description:
				'Change the color of a specified node. Available colors are red (#FF0000), green (#00FF00), yellow (#FFFF00), pink (#FFC0CB), and blue (#0074D9).',
			parameters: {
				type: 'object',
				properties: {
					nodeId: {
						type: 'string',
						description: 'The ID of the node to color.'
					},
					color: {
						type: 'string',
						description: 'The hex code of the desired color.'
					}
				},
				required: ['nodeId', 'color']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'reset_node_color',
			strict: true,
			description: 'Reset the colors of all nodes to their default state.'
		}
	},
	{
		type: 'function',
		function: {
			name: 'run_tsp',
			strict: true,
			description:
				'Execute the Traveling Salesman Problem (TSP) algorithm to find the shortest possible route that starts from a specified node, visits all nodes in the given list exactly once, and returns to the starting node. If no list is specified, the function will visit all nodes in the graph.',
			parameters: {
				type: 'object',
				properties: {
					nodeIds: {
						type: 'array',
						items: {
							type: 'string'
						},
						description:
							'An array of node IDs that must be included in the TSP route. If not specified, all nodes in the graph will be visited.'
					},
					startNodeId: {
						type: 'string',
						description:
							'The ID of the node where the TSP route should begin and end. This node must be included in the nodeIds array or be part of the graph if nodeIds is not specified.'
					}
				},
				required: ['startNodeId']
			}
		}
	}
];
