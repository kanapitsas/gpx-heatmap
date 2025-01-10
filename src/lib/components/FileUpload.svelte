<script>
	import '$lib/styles/common.css';
	let { onclick } = $props();

	function handleChange(event) {
		const files = Array.from(event.target.files);
		if (files.length > 0) {
			onclick?.(files);
			event.target.value = '';
		}
	}
</script>

<div class="upload-container">
	<div>
		<input
			type="file"
			accept=".gpx"
			multiple
			id="file-input"
			onchange={handleChange}
			class="hidden-input"
		/>
		<label for="file-input" class="control-button">
			<svg
				class="control-icon"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="17 8 12 3 7 8" />
				<line x1="12" y1="3" x2="12" y2="15" />
			</svg>
			Import GPX
		</label>
	</div>
</div>

<style>
	.upload-container {
		display: contents;
	}

	.hidden-input {
		display: none;
	}
</style>
