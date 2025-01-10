<script>
	let { progress, show } = $props();

	// Calculate circle properties
	const size = 60;
	const radius = 28;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = circumference;

	// Adjust the offset calculation to ensure it goes to complete circle
	let offset = $derived((1 - progress / 100) * strokeDasharray);
</script>

{#if show}
	<div class="progress-circle">
		<svg width={size} height={size}>
			<circle class="circle-bg" r={radius} cx={size / 2} cy={size / 2} />
			<circle
				class="circle-progress"
				r={radius}
				cx={size / 2}
				cy={size / 2}
				style:stroke-dasharray={strokeDasharray}
				style:stroke-dashoffset={offset}
			/>
			<text x="50%" y="50%" class="percentage">
				{Math.round(progress)}%
			</text>
		</svg>
	</div>
{/if}

<style>
	.progress-circle {
		position: absolute;
		bottom: 100px;
		left: 20px;
		border-radius: 50%;
		z-index: 1000;
	}

	circle {
		fill: white;
		stroke-width: 3;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}

	.circle-bg {
		stroke: #f5f5f5;
	}

	.circle-progress {
		stroke: #2196f3;
		transition: stroke-dashoffset 0.3s;
	}

	.percentage {
		fill: #2196f3;
		font-size: 14px;
		text-anchor: middle;
		dominant-baseline: middle;
		transform: translateY(1px);
	}
</style>
