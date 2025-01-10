<script>
	import '$lib/styles/common.css';
	import { fade } from 'svelte/transition';
	let { count, onclick } = $props();
	let isHovered = $state(false);

	function onkeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onclick();
		}
	}
</script>

{#if count > 0}
	<div
		class="control-button"
		{onclick}
		{onkeydown}
		role="button"
		tabindex="0"
		transition:fade={{ duration: 200 }}
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
	>
		<div class="button-content">
			{#if !isHovered}
				<div class="button-face" transition:fade={{ duration: 200 }}>
					<svg
						class="control-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M3 3v18h18" />
						<path d="M18 17V9" />
						<path d="M13 17V5" />
						<path d="M8 17v-3" />
					</svg>
					<span>{count} tracks</span>
				</div>
			{:else}
				<div class="button-face" transition:fade={{ duration: 200 }}>
					<svg
						class="control-icon"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6L6 18" />
						<path d="M6 6l12 12" />
					</svg>
					<span>Clear</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.control-button {
		width: 100px;
	}

	.button-content {
		position: relative;
		height: 20px;
	}

	.button-face {
		display: flex;
		align-items: center;
		gap: 8px;
		position: absolute;
		left: 0;
		right: 0;
	}

	:global(.control-icon) {
		width: 16px;
		height: 16px;
		stroke: currentColor;
		flex-shrink: 0;
	}
</style>
