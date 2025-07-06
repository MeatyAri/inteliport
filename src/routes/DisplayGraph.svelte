<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import cytoscape from 'cytoscape';
	import { shared } from '$lib/shared.svelte';

	let container: HTMLDivElement;
	let clockInterval: NodeJS.Timeout;

	onMount(() => {
		// Initialize Cytoscape
		shared.graph = cytoscape({
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
				{ data: { id: 'ab', source: 'a', target: 'b', label: 'Edge A-B', weight: 1, traffic: 0 } },
				{ data: { id: 'bc', source: 'b', target: 'c', label: 'Edge B-C', weight: 2, traffic: 0 } },
				{ data: { id: 'cd', source: 'c', target: 'd', label: 'Edge C-D', weight: 3, traffic: 0 } },
				{ data: { id: 'da', source: 'd', target: 'a', label: 'Edge D-A', weight: 4, traffic: 0 } },
				{ data: { id: 'ae', source: 'a', target: 'e', label: 'Edge A-E', weight: 5, traffic: 0 } },
				{ data: { id: 'ef', source: 'e', target: 'f', label: 'Edge E-F', weight: 6, traffic: 0 } },
				{ data: { id: 'fc', source: 'f', target: 'c', label: 'Edge F-C', weight: 7, traffic: 0 } }
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
						'line-color': '#6a6a6a',
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
				},
				{
					selector: 'edge.highlighted-Traffic1',
					style: {
						'line-color': '#FFEF00',
						'target-arrow-color': '#FFEF00',
						width: 4
					}
				},
				{
					selector: 'edge.highlighted-Traffic2',
					style: {
						'line-color': '#FF0000',
						'target-arrow-color': '#FF0000',
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
		shared.graph.on('tap', 'node', function (evt) {
			const node = evt.target;
		});

		shared.graph.on('tap', 'edge', function (evt) {
			const edge = evt.target;
		});

		// Add context menu functionality
		shared.graph.on('cxttap', 'node', function (evt) {
			const node = evt.target;
			alert(`Right-clicked on ${node.data('label')}`);
		});

		// Connect the trip manager to the graph
		shared.tripManager.setGraph(shared.graph);

		// Start the clock update interval for the UI
		clockInterval = setInterval(() => {
			shared.currentTime = shared.tripManager.getCurrentTime();
		}, 1000);

		return () => {
			if (shared.graph) {
				shared.graph.destroy();
			}
		};
	});

	onDestroy(() => {
		if (clockInterval) {
			clearInterval(clockInterval);
		}
	});
</script>

<div class="h-[80%] w-full" bind:this={container}></div>

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
