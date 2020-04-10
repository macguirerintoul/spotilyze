<template>
	<div id="BreakdownTracksByArtist"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
			console.log(result)
			this.tracks = result
			embed('#BreakdownTracksByArtist', this.vegaSpec, { actions: false })
		})
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json',
				title: 'Breakdown of tracks by key',
				width: 700,
				height: 400,
				padding: 5,
				data: [
					{
						name: 'tracks',
						values: this.tracks
					}
				],

				scales: [
					{
						name: 'xscale',
						type: 'band',
						domain: { data: 'table', field: 'album.album_type' },
						range: 'width',
						padding: 0.05,
						round: true
					},
					{
						name: 'yscale',
						domain: { data: 'table', field: 'amount' },
						nice: true,
						range: 'height'
					}
				],
				axes: [
					{ orient: 'bottom', scale: 'xscale' },
					{ orient: 'left', scale: 'yscale' }
				],
				marks: [
					{
						type: 'rect',
						from: { data: 'table' },
						encode: {
							enter: {
								x: { scale: 'xscale', field: 'category' },
								width: { scale: 'xscale', band: 1 },
								y: { scale: 'yscale', field: 'amount' },
								y2: { scale: 'yscale', value: 0 }
							},
							update: {
								fill: { value: 'steelblue' }
							},
							hover: {
								fill: { value: 'red' }
							}
						}
					}
				]
			}
		}
	},
	data() {
		return {
			tracks: []
		}
	}
}
</script>
