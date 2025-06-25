<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { updateTheme } from '$lib/index';

	let { children } = $props();

	onMount(() => {
		// Listen for changes in system theme
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			updateTheme();
		};
		mediaQuery.addEventListener('change', handleChange);

		updateTheme();

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});
</script>

{@render children()}
