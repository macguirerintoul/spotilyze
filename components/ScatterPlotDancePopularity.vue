<template>
	<div id="ScatterPlotDancePopularity"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		console.log('created')
		this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
			/* Here, we need to keep the popularity values we have since they aren't returned by the audio features API */
			this.popularityData = result.map(item => ({
				id: item.track.id,
				popularity: item.track.popularity
			}))
			this.$axios
				.$post('.netlify/functions/getAudioFeatures', {
					ids: result.map(item => item.track.id)
				})
				.then(result => {
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
					{ name: 'popularity', values: this.popularityData },
					{
						name: 'tracks',
						values: this.tracks,
						transform: [
							{
								type: 'lookup',
								from: 'popularity',
								key: 'id',
								fields: ['id'],
								values: ['popularity'],
								as: ['popularity']
							}
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
						domain: { data: 'tracks', field: 'popularity' },
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
						title: 'Popularity'
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
								x: { scale: 'x', field: 'popularity' },
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
			tracks: [],
			popularityData: []
		}
	}
}
</script>
