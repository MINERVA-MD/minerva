<template>
	<button
		v-on:click="toLoginPage"
		class="flex items-end opacity-80 hover:opacity-100 text-minerva-gray font-semi-bold transition-colors duration-100"
	>
		<p class="flex items-end mr-2" v-if="gitService">
			{{ gitService.username }}
		</p>
		<svg
			v-if="!gitService"
			width="28"
			height="28"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-user"
			version="1.1"
			id="svg828"
			sodipodi:docname="user.svg"
			inkscape:version="1.1.2 (b8e25be8, 2022-02-05)"
			xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
			xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:svg="http://www.w3.org/2000/svg"
		>
			<defs id="defs832" />
			<sodipodi:namedview
				id="namedview830"
				pagecolor="#505050"
				bordercolor="#eeeeee"
				borderopacity="1"
				inkscape:pageshadow="0"
				inkscape:pageopacity="0"
				inkscape:pagecheckerboard="0"
				showgrid="false"
				inkscape:zoom="27.083333"
				inkscape:cx="12.055385"
				inkscape:cy="12"
				inkscape:window-width="1312"
				inkscape:window-height="872"
				inkscape:window-x="0"
				inkscape:window-y="0"
				inkscape:window-maximized="0"
				inkscape:current-layer="svg828"
			/>
			<path
				d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
				id="path824"
				style="stroke: #404040; stroke-opacity: 1"
			/>
			<circle
				cx="12"
				cy="7"
				r="4"
				id="circle826"
				style="stroke: #404040; stroke-opacity: 1"
			/>
		</svg>
		<img
			v-else-if="gitService && gitService.avatarUrl"
			class="w-7 rounded-full"
			:src="gitService.avatarUrl"
			alt="user avatar"
		/>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	data(): {} {
		return {};
	},
	props: ['gitService'],
	methods: {
		toLoginPage() {
			this.$router.push('/gitservice');
		},
	},
});
</script>
