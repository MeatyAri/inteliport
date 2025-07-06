<script lang="ts">
	import { onMount } from 'svelte';
	import cytoscape from 'cytoscape';
	import { shared } from '$lib/shared.svelte';

	let container: HTMLDivElement;

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

				{ data: { id: 'g', label: 'G' } },
				{ data: { id: 'h', label: 'H' } },
				{ data: { id: 'i', label: 'I' } },
				{ data: { id: 'j', label: 'J' } },
				{ data: { id: 'k', label: 'K' } },
				{ data: { id: 'l', label: 'L' } },
				{ data: { id: 'm', label: 'M' } },
				{ data: { id: 'n', label: 'N' } },
				{ data: { id: 'o', label: 'O' } },
				{ data: { id: 'p', label: 'P' } },

				// Edges
				{ data: { id: 'ab', source: 'a', target: 'b', label: 'Edge A-B', weight: 1 } },
				{ data: { id: 'cf', source: 'c', target: 'f', label: 'Edge C-F', weight: 2 } },
				{ data: { id: 'gh', source: 'g', target: 'h', label: 'Edge G-H', weight: 3 } },
				{ data: { id: 'de', source: 'd', target: 'e', label: 'Edge D-E', weight: 4 } },
				{ data: { id: 'ik', source: 'i', target: 'k', label: 'Edge I-K', weight: 5 } },
				{ data: { id: 'jl', source: 'j', target: 'l', label: 'Edge J-L', weight: 6 } },
				{ data: { id: 'mn', source: 'm', target: 'n', label: 'Edge M-N', weight: 7 } },
				{ data: { id: 'op', source: 'o', target: 'p', label: 'Edge O-P', weight: 8 } },
				{ data: { id: 'ah', source: 'a', target: 'h', label: 'Edge A-H', weight: 9 } },
				{ data: { id: 'bg', source: 'b', target: 'g', label: 'Edge B-G', weight: 10 } },
				{ data: { id: 'ef', source: 'e', target: 'f', label: 'Edge E-F', weight: 11 } },
				{ data: { id: 'kj', source: 'k', target: 'j', label: 'Edge K-J', weight: 12 } },
				{ data: { id: 'no', source: 'n', target: 'o', label: 'Edge N-O', weight: 13 } },
				{ data: { id: 'cd', source: 'c', target: 'd', label: 'Edge C-D', weight: 14 } },
				{ data: { id: 'lp', source: 'l', target: 'p', label: 'Edge L-P', weight: 15 } },
				{ data: { id: 'ma', source: 'm', target: 'a', label: 'Edge M-A', weight: 16 } },
				{ data: { id: 'de', source: 'd', target: 'b', label: 'Edge D-B', weight: 17 } },
				{ data: { id: 'eo', source: 'e', target: 'o', label: 'Edge E-O', weight: 18 } },
				{ data: { id: 'jh', source: 'j', target: 'h', label: 'Edge J-H', weight: 19 } },
				{ data: { id: 'hn', source: 'h', target: 'n', label: 'Edge H-N', weight: 20 } }
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
			console.log('Tapped node:', node.data('label'));
		});

		shared.graph.on('tap', 'edge', function (evt) {
			const edge = evt.target;
			console.log('Tapped edge:', edge.data('label'));
		});

		// Add context menu functionality
		shared.graph.on('cxttap', 'node', function (evt) {
			const node = evt.target;
			alert(`Right-clicked on ${node.data('label')}`);
		});

		return () => {
			if (shared.graph) {
				shared.graph.destroy();
			}
		};
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
