<template>
	<div class="ml-6 flex items-center text-sm">
		<span v-if="roomId" class="font-semibold text-minerva-gray">
			Room ID:</span
		>
		<button
			v-if="roomId"
			class="bg-minerva-purple text-white py-0.5 px-2 rounded ml-2 flex hover:opacity-90 duration-100 transition-all items-center"
			@click="copyRoomIdToClipboard"
		>
			{{ roomId }}
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-copy opacity-50 ml-1.5"
				version="1.1"
				id="svg6"
				sodipodi:docname="copy.svg"
				inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
				xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
				xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:svg="http://www.w3.org/2000/svg"
			>
				<defs id="defs10" />
				<sodipodi:namedview
					id="namedview8"
					pagecolor="#ffffff"
					bordercolor="#666666"
					borderopacity="1.0"
					inkscape:pageshadow="2"
					inkscape:pageopacity="0.0"
					inkscape:pagecheckerboard="0"
					showgrid="false"
					inkscape:zoom="34.958333"
					inkscape:cx="11.985697"
					inkscape:cy="12"
					inkscape:window-width="1912"
					inkscape:window-height="1040"
					inkscape:window-x="4"
					inkscape:window-y="300"
					inkscape:window-maximized="0"
					inkscape:current-layer="svg6"
				/>
				<rect
					x="9"
					y="9"
					width="13"
					height="13"
					rx="2"
					ry="2"
					id="rect2"
					style="stroke: #fefefe; stroke-opacity: 1"
				/>
				<path
					d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
					id="path4"
					style="stroke: #ffffff; stroke-opacity: 1"
				/>
			</svg>
		</button>
		<span v-if="copied" class="font-semibold ml-2 text-gray-500">{{
			copied ? 'copied!' : ''
		}}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: ['roomId'],
	data(): {
		copied: boolean;
	} {
		return {
			copied: false,
		};
	},
	methods: {
		copyRoomIdToClipboard() {
			navigator.clipboard.writeText(this.roomId ? this.roomId : '');
			setTimeout(() => {
				this.copied = false;
			}, 2000);
			this.copied = true;
		},
	},
});
</script>
