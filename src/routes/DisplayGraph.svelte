<script lang="ts">
	import { onMount } from 'svelte';
	import cytoscape from 'cytoscape';
	import { runKruskal } from '$lib/mst';
	import { clearHighlights, highlightEdges } from '$lib/highlights';

	let container: HTMLDivElement;
	let cy: cytoscape.Core;

	onMount(() => {
		// Initialize Cytoscape
		cy = cytoscape({
			container: container,

			elements: [
				// Nodes
				{ data: { id: 'a', label: 'A' } },
				{ data: { id: 'b', label: 'B' } },
				{ data: { id: 'c', label: 'C' } },
				{ data: { id: 'd', label: 'D' } },
				{ data: { id: 'e', label: 'E' } },
				{ data: { id: 'f', label: 'F' } },

				// Edges
				{ data: { id: 'ab', source: 'a', target: 'b', label: 'Edge A-B', weight: 1 } },
				{ data: { id: 'bc', source: 'b', target: 'c', label: 'Edge B-C', weight: 2 } },
				{ data: { id: 'cd', source: 'c', target: 'd', label: 'Edge C-D', weight: 3 } },
				{ data: { id: 'da', source: 'd', target: 'a', label: 'Edge D-A', weight: 4 } },
				{ data: { id: 'ae', source: 'a', target: 'e', label: 'Edge A-E', weight: 5 } },
				{ data: { id: 'ef', source: 'e', target: 'f', label: 'Edge E-F', weight: 6 } },
				{ data: { id: 'fc', source: 'f', target: 'c', label: 'Edge F-C', weight: 7 } }
			],

			style: [
				{
					selector: 'node',
					style: {
						'background-color': '#0074D9',
						label: 'data(label)',
						color: 'white',
						'text-valign': 'center',
						'text-halign': 'center',
						'font-size': '12px',
						'font-weight': 'bold',
						width: '35px',
						height: '35px'
					}
				},
				{
					selector: 'edge',
					style: {
						width: 3,
						'line-color': '#FF4136',
						'target-arrow-color': '#FF4136',
						'target-arrow-shape': 'none',
						'curve-style': 'bezier',
						label: 'data(weight)',
						'font-size': '10px',
						color: '#FFF',
						'text-rotation': 'autorotate',
						'text-margin-y': -10
					}
				},
				{
					selector: 'node:selected',
					style: {
						'background-color': '#FF851B',
						'border-color': '#B10DC9'
					}
				},
				{
					selector: 'edge:selected',
					style: {
						'line-color': '#B10DC9',
						'target-arrow-color': '#B10DC9'
					}
				},
				{
					selector: 'edge.highlighted',
					style: {
						'line-color': '#2ECC40',
						'target-arrow-color': '#2ECC40',
						width: 4
					}
				}
			],

			layout: {
				name: 'circle',
				radius: 150
			},

			// Interaction options
			userZoomingEnabled: true,
			userPanningEnabled: true,
			boxSelectionEnabled: true,
			selectionType: 'single' as cytoscape.SelectionType
		});

		// Add event listeners
		cy.on('tap', 'node', function (evt) {
			const node = evt.target;
			console.log('Tapped node:', node.data('label'));
		});

		cy.on('tap', 'edge', function (evt) {
			const edge = evt.target;
			console.log('Tapped edge:', edge.data('label'));
		});

		// Add context menu functionality
		cy.on('cxttap', 'node', function (evt) {
			const node = evt.target;
			alert(`Right-clicked on ${node.data('label')}`);
		});

		return () => {
			if (cy) {
				cy.destroy();
			}
		};
	});

	// Function to add a new node
	function addNode() {
		if (cy) {
			const nodeId = `node_${Date.now()}`;
			cy.add({
				data: { id: nodeId, label: `New Node ${nodeId.slice(-4)}` },
				position: { x: Math.random() * 400, y: Math.random() * 400 }
			});
		}
	}

	// Function to reset graph
	function resetGraph() {
		if (cy) {
			cy.fit();
			cy.center();
		}
	}
	// Function to run MST
	function runMst() {
		const mst = runKruskal(cy);

		// highlight the MST Path
		clearHighlights(cy);
		highlightEdges(mst);
	}

	//Function to check whether all pairs of nodes are reachable within two hops
	function checkAllPairsThreeHopReachability(cyto: cytoscape.Core): boolean {
		const nodes = cyto.nodes();
		if (nodes.length === 0) {
			return true; // Empty graph is trivially reachable
		}

		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				// Avoid redundant checks and self-checks
				const startNode = nodes.eq(i);
				const endNode = nodes.eq(j);

				if (!isReachableWithinTwoHops(cyto, startNode.id(), endNode.id())) {
					return false; // If any pair is not reachable, the whole graph is not
				}
			}
		}

		return true; // All pairs are reachable within 2 hops
	}

	/**
	 * Checks if a specific end node is reachable from a start node within a maximum of 2 hops.
	 *
	 * @param cyto The Cytoscape instance.
	 * @param startNodeId The ID of the starting node.
	 * @param endNodeId The ID of the ending node.
	 * @returns True if the end node is reachable within 2 hops, false otherwise.
	 */
	function isReachableWithinTwoHops(
		cyto: cytoscape.Core,
		startNodeId: string,
		endNodeId: string
	): boolean {
		const visited = new Set<string>();
		const queue: string[] = [startNodeId];
		visited.add(startNodeId);

		let hopCount = 0;

		while (queue.length > 0 && hopCount <= 3) {
			const currentLevelSize = queue.length;

			for (let i = 0; i < currentLevelSize; i++) {
				const currentNodeId = queue.shift()!;

				if (currentNodeId === endNodeId) {
					return true; // Reached the end node
				}

				const neighbors = cyto.nodes(`#${currentNodeId}`).neighborhood().nodes();
				for (const neighbor of neighbors) {
					if (!visited.has(neighbor.id())) {
						visited.add(neighbor.id());
						queue.push(neighbor.id());
					}
				}
			}

			hopCount++;
		}

		return false; // Did not reach the end node within 2 hops
	}
</script>

<div class="h-[80%] w-full" bind:this={container}></div>
<button class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onclick={runMst}>
	Run MST
</button>

<button
	class="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
	onclick={() => {
		const result = checkAllPairsThreeHopReachability(cy);
		alert(
			result
				? 'All nodes are reachable within two hops.'
				: 'Not all nodes are reachable within two hops.'
		);
	}}
>
	Check all pairs 2-Hop Reachability
</button>

<!-- <div class="graph-container p-5 font-sans">
	<div class="info mt-5 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-3 dark:bg-gray-800">
		<h3 class="mt-0 text-lg text-gray-800 dark:text-gray-200">Instructions:</h3>
		<ul class="mt-2 list-disc pl-5 text-gray-600 dark:text-gray-400">
			<li>Click on nodes or edges to select them</li>
			<li>Right-click on nodes for context menu</li>
			<li>Use mouse wheel to zoom in/out</li>
			<li>Click and drag to pan the graph</li>
			<li>Use the layout buttons to change the arrangement</li>
		</ul>
	</div>
</div> -->
