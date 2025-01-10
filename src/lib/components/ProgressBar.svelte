<script>
	let { progress, show } = $props();
</script>

{#if show}
	<div class="progress-container">
		<div class="progress-bar" style="width: {progress}%">
			{Math.round(progress)}%
		</div>
	</div>
{/if}

<style>
	.progress-container {
		width: 100%;
		height: 20px;
		background-color: #f0f0f0;
		border-radius: 4px;
		margin: 10px 0;
	}

	.progress-bar {
		height: 100%;
		background-color: #4caf50;
		border-radius: 4px;
		text-align: center;
		line-height: 20px;
		color: white;
		transition: width 0.3s ease;
	}
</style>
