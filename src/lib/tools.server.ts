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
	},
	{
		type: 'function',
		function: {
			name: 'delete_edge',
			strict: true,
			description: 'Delete/remove an edge from the graph.',
			parameters: {
				type: 'object',
				properties: {
					nodeId1: {
						type: 'string',
						description: 'The first node of the edge.'
					},
					nodeId2: {
						type: 'string',
						description: 'The second node of the edge.'
					}
				}
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'color_node',
			strict: true,
			description: 'Make a node a certain color, only possible color is red = #FF0000,green = #00FF00,yellow = #FFFF00,pink = #FFC0CB, blue =0074D9.',
			parameters: {
				type: 'object',
				properties: {
					nodeId: {
						type: 'string',
						description: 'The id of the node.'
					},
					color: {
						type: 'string',
						description: 'hex id of the wanted color.'
					}
				}
			}

		}
	},
	{
		type: 'function',
		function: {
			name: 'reset_node_color',
			strict: true,
			description: 'reset nodes colors.',
		}
	},
	{
		type: 'function',
		function: {
			name: 'run_tsp',
			strict: true,
			description:
				'Run the Traveling Salesman Problem (TSP) algorithm on the graph to find the shortest possible route that starts from a specified node and visits all nodes in the given list exactly once before returning to the starting node. If no list is specified, the function will visit all nodes in the graph. This function calculates the optimal path for visiting all specified nodes with minimal total distance.',
			parameters: {
				type: 'object',
				properties: {
					nodeIds: {
						type: 'array',
						items: {
							type: 'string'
						},
						description:
							'An array of node identifiers that must be included in the TSP route. If not specified, all nodes in the graph will be visited. The algorithm will find the shortest path that visits all these nodes exactly once.'
					},
					startNodeId: {
						type: 'string',
						description:
							'The identifier of the node where the TSP route should begin and end. This node must be included in the nodeIds array or be part of the graph if nodeIds is not specified.'
					}
				},
				required: ['startNodeId']
			}
		}
	}

];
