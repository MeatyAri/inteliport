<script lang="ts">
	import { fly } from 'svelte/transition';
	import DisplayGraph from './DisplayGraph.svelte';
	import { handleToolCalls } from './Tools';
	import { shared } from '$lib/shared.svelte';
	import { serializeGraph } from '$lib/graph/serialize';
	import { formatTime } from '$lib/trip/tripPlanning';

	// Define the navigation items and selected state
	const navItems = ['Graph', 'Profile', 'Settings'];
	let selectedNav: string = $state('Graph');

	function selectNav(item: string) {
		selectedNav = item;
	}

	// Define the text variable and adjustHeight function for dynamic textarea height
	let text: string = $state('');
	let textarea: HTMLTextAreaElement;

	let myForm: HTMLFormElement;

	function adjustHeight() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight + 2}px`;
		}
	}

	let isNavOpen: boolean = $state(false);

	function handleShortcuts(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (text.trim() === '') {
				return;
			}
			if (event.ctrlKey) {
				triggerCtrlEnterFunction();
			} else {
				triggerEnterFunction();
			}
		} else if (event.key === 'Escape') {
			shared.agentResponse = '';
		}
	}

	let tripDetails: any = $state(null);

	async function triggerEnterFunction() {
		console.log('Enter function triggered');

		// Serialize the current graph for context
		let graphData = null;
		if (shared.graph) {
			graphData = serializeGraph(shared.graph);
		}

		// Call the Agent API with graph context
		const response = await fetch('/api/agent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ query: text, graphData })
		});

		const data = await response.json();

		// Extract tool calls from the response and execute functions
		if (data.tool_calls) {
			handleToolCalls(data);

			// Check if a trip was planned
			const planTripCall = data.tool_calls.find((call: any) => call.function.name === 'plan_trip');

			if (planTripCall && shared.pendingTrip) {
				// Extract trip details from the pending trip
				const trip = shared.pendingTrip;
				tripDetails = {
					id: trip.id,
					source: trip.path[0]?.toUpperCase(),
					target: trip.path[trip.path.length - 1]?.toUpperCase(),
					distance: trip.edges.reduce(
						(sum: number, edge: any) => sum + (edge.data('weight') || 0),
						0
					),
					duration: trip.duration,
					estimatedStartTime: formatTime(trip.estimatedStartTime || trip.startTime),
					currentTime: formatTime(shared.tripManager.getCurrentTime()),
					canStartImmediately:
						(trip.estimatedStartTime || trip.startTime) === shared.tripManager.getCurrentTime(),
					waitTime: Math.max(
						0,
						(trip.estimatedStartTime || trip.startTime) - shared.tripManager.getCurrentTime()
					),
					path: trip.path.filter((p: string) => p.length === 1).map((p: string) => p.toUpperCase()),
					trafficStatus: getTrafficStatus(trip.edges)
				};
			}
		}

		// Store the agent response
		shared.agentResponse = data.content || '';
	}

	function triggerCtrlEnterFunction() {
		console.log('Ctrl+Enter function triggered');
		// Add your logic here for Ctrl+Enter key press
		text = '';
		shared.agentResponse = '';
		tripDetails = null;
		shared.pendingTrip = null;
		if (textarea) {
			textarea.focus();
		}
	}
	function getTrafficStatus(edges: any[]): string {
		const maxTraffic = Math.max(...edges.map((edge) => edge.data('traffic') || 0));
		if (maxTraffic >= 2) {
			return 'Heavy Traffic - Route at capacity';
		} else if (maxTraffic >= 1) {
			return 'Moderate Traffic - Some congestion';
		}
		return 'Clear';
	}

	function confirmTrip() {
		if (shared.pendingTrip) {
			const result = shared.tripManager.startTrip(shared.pendingTrip.id);
			if (result) {
				shared.agentResponse = 'Trip started successfully!';
				tripDetails = null;
				shared.pendingTrip = null;
			} else {
				shared.agentResponse = 'Failed to start trip. Route may be at capacity.';
			}
		}
	}

	function cancelTrip() {
		tripDetails = null;
		shared.pendingTrip = null;
		shared.agentResponse = 'Trip cancelled.';
	}
</script>

<svelte:head>
	<title>Inteliport</title>
</svelte:head>

<!-- Mobile Navigation Bar -->
<div class="absolute top-0 w-full p-3 xl:hidden">
	<button
		onclick={() => (isNavOpen = !isNavOpen)}
		class="
    		{isNavOpen ? 'hidden' : ''}
    		w-full rounded-lg bg-zinc-200 px-4 py-2 text-center font-medium dark:bg-zinc-600
		"
	>
		{selectedNav}
	</button>
	{#if isNavOpen}
		<nav
			class="w-full rounded-xl bg-white shadow-md dark:bg-zinc-700"
			in:fly={{ y: -5, opacity: 0, duration: 300 }}
		>
			<ul class="flex flex-col gap-1">
				{#each navItems as item}
					<li>
						<button
							onclick={() => {
								selectNav(item);
								isNavOpen = false;
							}}
							class="
									w-full rounded-lg px-4 py-2 text-center font-medium
									hover:cursor-pointer hover:bg-zinc-300 active:bg-zinc-300
									dark:hover:bg-zinc-500 dark:active:bg-zinc-600
									{selectedNav === item ? 'bg-zinc-200 dark:bg-zinc-600' : ''}
									transition-colors duration-300
									hover:transition-none
								"
						>
							{item}
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</div>

<!-- Main container with darkmode support -->
<div class="flex h-screen w-full gap-4 p-4 shadow-lg">
	<!-- Left Navigation Bar -->
	<nav class="hidden w-64 rounded-xl bg-white p-3 shadow-md xl:block dark:bg-zinc-700">
		<ul class="flex flex-col gap-1">
			{#each navItems as item}
				<li>
					<button
						onclick={() => selectNav(item)}
						class="
						    w-full rounded-lg px-4 py-2 text-left font-medium
                            hover:cursor-pointer hover:bg-zinc-300 active:bg-zinc-300
                            dark:hover:bg-zinc-500 dark:active:bg-zinc-600
                            {selectedNav === item ? 'bg-zinc-200 dark:bg-zinc-600' : ''}
                            transition-colors duration-300
                            hover:transition-none
                        "
					>
						{item}
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Main Display Area -->
	<main class="flex flex-1 flex-col items-center justify-between p-4 pb-32">
		<div id="main-content" class="flex h-full w-full flex-col items-center justify-around pt-10">
			{#if selectedNav === 'Graph'}
				<p>Welcome to the Graph page.</p>
				<DisplayGraph />
			{:else if selectedNav === 'Profile'}
				<div class="text-center">
					<h1 class="mb-4 text-2xl font-bold">Profile</h1>
					<p>Here is your profile information.</p>
				</div>
			{:else if selectedNav === 'Settings'}
				<div class="text-center">
					<h1 class="mb-4 text-2xl font-bold">Settings</h1>
					<p>Configure your preferences here.</p>
				</div>
			{/if}
		</div>

		<!-- Text Input at the Bottom -->
		<div class="absolute bottom-7 w-full lg:w-5xl">
			<!-- Trip Details Display -->
			{#if tripDetails}
				<div class="relative top-10 z-10 rounded-t-3xl bg-blue-500/95 p-6 pb-14">
					<div class="text-white">
						<h3 class="mb-4 text-xl font-bold">🚗 Trip Details</h3>
						<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<p class="text-sm opacity-80">Route</p>
								<p class="text-lg font-semibold">{tripDetails.source} → {tripDetails.target}</p>
							</div>
							<div>
								<p class="text-sm opacity-80">Path</p>
								<p class="text-lg font-semibold">{tripDetails.path.join(' → ')}</p>
							</div>
							<div>
								<p class="text-sm opacity-80">Distance</p>
								<p class="text-lg font-semibold">{tripDetails.distance} units</p>
							</div>
							<div>
								<p class="text-sm opacity-80">Duration</p>
								<p class="text-lg font-semibold">
									{Math.floor(tripDetails.duration / 60)}m {tripDetails.duration % 60}s
								</p>
							</div>
							<div>
								<p class="text-sm opacity-80">Current Time</p>
								<p class="text-lg font-semibold">{tripDetails.currentTime}</p>
							</div>
							<div>
								<p class="text-sm opacity-80">Start Time</p>
								<p class="text-lg font-semibold">{tripDetails.estimatedStartTime}</p>
							</div>
						</div>
						<div class="mb-4">
							<p class="text-sm opacity-80">Traffic Status</p>
							<p class="text-lg font-semibold">{tripDetails.trafficStatus}</p>
						</div>
						{#if !tripDetails.canStartImmediately}
							<div class="mb-4 rounded-lg bg-yellow-500/20 p-3">
								<p class="text-sm">
									⏳ Wait time: {Math.floor(tripDetails.waitTime / 60)}m {tripDetails.waitTime %
										60}s
								</p>
							</div>
						{/if}
						<div class="flex gap-3">
							<button
								onclick={confirmTrip}
								class="rounded-lg bg-green-600 px-6 py-2 font-medium transition-colors hover:bg-green-700"
							>
								✅ Confirm Trip
							</button>
							<button
								onclick={cancelTrip}
								class="rounded-lg bg-red-600 px-6 py-2 font-medium transition-colors hover:bg-red-700"
							>
								❌ Cancel
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Agent Response Display -->
			<div
				class="
    			    relative top-10 z-10 rounded-t-3xl bg-emerald-500/95 p-4 pb-14
    				{shared.agentResponse && !tripDetails ? '' : 'hidden'}
				"
			>
				<p class="text-md text-black">{shared.agentResponse}</p>
			</div>
			<textarea
				bind:value={text}
				bind:this={textarea}
				oninput={adjustHeight}
				onkeydown={handleShortcuts}
				placeholder="Type something..."
				class="
					relative z-20 w-full resize-none rounded-3xl border border-zinc-300 bg-white
					p-4 text-zinc-900 shadow-2xl focus:border-emerald-500 focus:outline-none
					dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100
				"
			></textarea>
		</div>
	</main>
</div>

<!-- Clock Display -->
<div class="absolute top-4 right-4 rounded-lg bg-white p-3 shadow-md dark:bg-zinc-700">
	<div class="text-center">
		<p class="text-xs text-gray-600 dark:text-gray-300">System Time</p>
		<p class="font-mono text-lg font-bold">{formatTime(shared.currentTime)}</p>
	</div>
</div>
