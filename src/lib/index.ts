// Check system theme and toggle dark mode
export function updateTheme(theme?: string) {
	if (!theme) {
		const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	} else {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}
