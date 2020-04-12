<template>
	<div id="ArtistPopularityDistribution"></div>
</template>
<script>
import embed from 'vega-embed'
import { isMinMaxOp } from 'vega-lite/build/src/aggregate'

export default {
	props: { artists: Array },
	mounted() {
		this.draw()
	},
	watch: {
		vegaSpec(v) {
			if (v) this.draw()
		}
	},
	methods: {
		async draw() {
			await embed('#ArtistPopularityDistribution', this.vegaSpec).then(
				result => {
					result.view.addSignalListener('select', (name, value) => {
						console.log('select: ' + value.bin_maxbins_10_popularity)
						let min, max
						if (typeof value !== undefined) {
							min = value.bin_maxbins_10_popularity
							max = value.bin_maxbins_10_popularity_end
						} else {
							min = 0
							max = 100
						}
						this.$parent.setPopularityFilter(min, max)
					})
				}
			)
		}
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega-lite/v4.json',
				title: 'Distribution of artists over popularity',
				width: 700,
				height: 400,
				padding: 5,
				data: {
					name: 'artists',
					values: this.artists
				},
				selection: {
					highlight: { type: 'single', empty: 'none', on: 'mouseover' },
					select: {
						type: 'single',
						fields: [
							'bin_maxbins_10_popularity',
							'bin_maxbins_10_popularity_end'
						]
					}
				},
				mark: {
					type: 'bar',
					fill: '#4C78A8',
					stroke: 'black',
					cursor: 'pointer'
				},
				encoding: {
					x: {
						bin: true,
						field: 'popularity',
						type: 'quantitative'
					},
					y: {
						aggregate: 'count',
						type: 'quantitative'
					},
					fillOpacity: {
						condition: { selection: 'select', value: 1 },
						value: 0.3
					},
					strokeWidth: {
						condition: [
							{
								test: {
									and: [{ selection: 'select' }, 'length(data("select_store"))']
								},
								value: 2
							},
							{ selection: 'highlight', value: 1 }
						],
						value: 0
					}
				}
			}
		}
	}
}
</script>
