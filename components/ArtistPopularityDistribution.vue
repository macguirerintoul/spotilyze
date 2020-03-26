<template>
	<div id="ArtistPopularityDistribution"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		console.log('created')
		this.$axios.$get('/.netlify/functions/getAllArtists').then(result => {
			this.$axios
				.$post('/.netlify/functions/getArtistDetails', {
					ids: result.map(item => item.id)
				})
				.then(result => {
					console.log(result)
					this.artists = result
					embed('#ArtistPopularityDistribution', this.vegaSpec, {
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
						name: 'artists',
						values: this.artists
					},
					{
						name: 'binned',
						source: 'artists',
						transform: [
							{
								type: 'bin',
								field: 'popularity',
								extent: [0, 100],
								step: 1,
								nice: false
							},
							{
								type: 'aggregate',
								key: 'bin0',
								groupby: ['bin0', 'bin1'],
								fields: ['bin0'],
								ops: ['count'],
								as: ['count']
							}
						]
					}
				],
				scales: [
					{
						name: 'xscale',
						type: 'linear',
						range: 'width',
						domain: [0, 100]
					},
					{
						name: 'yscale',
						type: 'linear',
						range: 'height',
						round: true,
						domain: { data: 'binned', field: 'count' },
						zero: true,
						nice: true
					}
				],
				axes: [
					{ orient: 'bottom', scale: 'xscale', zindex: 1 },
					{ orient: 'left', scale: 'yscale', tickCount: 5, zindex: 1 }
				],
				marks: [
					{
						type: 'rect',
						from: { data: 'binned' },
						encode: {
							update: {
								x: { scale: 'xscale', field: 'bin0' },
								x2: {
									scale: 'xscale',
									field: 'bin1'
								},
								y: { scale: 'yscale', field: 'count' },
								y2: { scale: 'yscale', value: 0 },
								fill: { value: 'steelblue' }
							},
							hover: { fill: { value: 'firebrick' } }
						}
					},
					{
						type: 'rect',
						from: { data: 'artists' },
						encode: {
							enter: {
								x: { scale: 'xscale', field: 'u' },
								width: { value: 1 },
								y: { value: 25 },
								height: { value: 5 },
								fill: { value: 'steelblue' },
								fillOpacity: { value: 0.4 }
							}
						}
					}
				]
			}
		}
	},
	data() {
		return {
			artists: []
		}
	}
}
</script>
