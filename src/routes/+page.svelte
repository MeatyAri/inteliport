<script lang="ts">
	// Define the navigation items and selected state
	const navItems = ['Home', 'Profile', 'Settings'];
	let selectedNav: string = $state('Home');

	function selectNav(item: string) {
		selectedNav = item;
	}

	// Define the text variable and adjustHeight function for dynamic textarea height
	let text: string = $state('');
	let textarea: HTMLTextAreaElement;

	function adjustHeight() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight + 2}px`;
		}
	}
</script>

<svelte:head>
	<title>Inteliport</title>
</svelte:head>

<!-- Main container with darkmode support -->
<div class="flex h-screen w-full gap-4 p-4 shadow-lg">
	<!-- Left Navigation Bar -->
	<nav class="w-64 rounded-xl bg-white p-3 shadow-md dark:bg-zinc-700">
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
		<div id="main-content" class="flex h-full w-full flex-col items-center justify-center">
			{#if selectedNav === 'Home'}
				<h1 class="mb-4 text-2xl font-bold">Home</h1>
				<p>Welcome to the home page.</p>
			{:else if selectedNav === 'Profile'}
				<h1 class="mb-4 text-2xl font-bold">Profile</h1>
				<p>Here is your profile information.</p>
			{:else if selectedNav === 'Settings'}
				<h1 class="mb-4 text-2xl font-bold">Settings</h1>
				<p>Configure your preferences here.</p>
			{/if}
		</div>

		<!-- Text Input at the Bottom -->
		<div class="absolute bottom-7 w-5xl p-4">
			<textarea
				bind:value={text}
				bind:this={textarea}
				oninput={adjustHeight}
				placeholder="Type something..."
				class="
					w-full resize-none rounded-3xl border border-zinc-300 bg-white p-4
					text-zinc-900 shadow-2xl focus:border-blue-500
					focus:ring-1 focus:ring-blue-500 focus:outline-none
					dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100
				"
			></textarea>
		</div>
	</main>
</div>
