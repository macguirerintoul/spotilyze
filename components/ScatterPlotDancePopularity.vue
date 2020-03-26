<template>
	<div id="ScatterPlotDancePopularity"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		console.log('created')
		this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
			this.$axios
				.$post('.netlify/functions/getAudioFeatures', { ids: result })
				.then(result => {
					console.log(result)
					this.tracks = result
					embed('#ScatterPlotDancePopularity', this.vegaSpec, {
						actions: false
					})
				})
		})
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json',
				width: 700,
				height: 400,
				padding: 5,
				data: [
					{
						name: 'tracks',
						values: this.tracks
					},
					{
						name: 'fields',
						values: [
							'acousticness',
							'danceability',
							'energy',
							'instrumentalness',
							'liveness',
							'speechiness',
							'valence'
						]
					}
				],
				scales: [
					{
						name: 'x',
						type: 'linear',
						round: true,
						nice: true,
						zero: true,
						domain: { data: 'tracks', field: 'energy' },
						range: 'width'
					},
					{
						name: 'y',
						type: 'linear',
						round: true,
						nice: true,
						zero: true,
						domain: { data: 'tracks', field: 'danceability' },
						range: 'height'
					}
				],
				axes: [
					{
						scale: 'x',
						grid: true,
						domain: false,
						orient: 'bottom',
						tickCount: 5,
						title: 'energy'
					},
					{
						scale: 'y',
						grid: true,
						domain: false,
						orient: 'left',
						titlePadding: 5,
						title: 'Danceability'
					}
				],
				marks: [
					{
						name: 'marks',
						type: 'symbol',
						from: { data: 'tracks' },
						encode: {
							update: {
								x: { scale: 'x', field: 'energy' },
								y: { scale: 'y', field: 'danceability' },
								shape: { value: 'circle' },
								opacity: { value: 0.5 },
								fill: { value: '#4682b4' }
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
