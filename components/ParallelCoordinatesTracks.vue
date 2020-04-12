<template>
	<div id="ParallelCoordinatesTracks"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	props: {
		artists: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			trackInfo: [],
			tracks: []
		}
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json',
				title:
					'Parallel coordinates of all tracks in library over 7 dimensions',
				width: 700,
				height: 400,
				padding: 5,
				config: {
					axisY: {
						titleX: -2,
						titleY: 410,
						titleAngle: 0,
						titleAlign: 'right',
						titleBaseline: 'top'
					}
				},
				signals: [
					{
						name: 'artists',
						value: this.artists.map(artist => artist.name)
					},
					{
						name: 'tooltip',
						value: {},
						on: [
							{
								events: '@myline:mouseover',
								update: {
									expr: 'group().datum.artists + " – " + group().datum.name'
								}
							}
						]
					}
				],
				data: [
					{ name: 'trackInfo', values: this.trackInfo },
					{
						name: 'tracks',
						values: this.tracks,
						transform: [
							{
								type: 'lookup',
								from: 'trackInfo',
								key: 'id',
								fields: ['id'],
								values: ['artists', 'name']
							},
							{
								// filter out tracks whose artist isn't in parent array
								type: 'filter',
								expr: 'indexof(artists, datum.artists[0]) > 0'
							}
						]
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
						name: 'ord',
						type: 'point',
						range: 'width',
						domain: { data: 'fields', field: 'data' }
					},
					{
						name: 'acousticness',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'acousticness' }
					},
					{
						name: 'danceability',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'danceability' }
					},
					{
						name: 'energy',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'energy' }
					},
					{
						name: 'instrumentalness',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'instrumentalness' }
					},
					{
						name: 'liveness',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'liveness' }
					},
					{
						name: 'speechiness',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'speechiness' }
					},
					{
						name: 'valence',
						type: 'linear',
						range: 'height',
						domain: { data: 'tracks', field: 'valence' }
					}
				],
				axes: [
					{
						orient: 'left',
						zindex: 1,
						scale: 'acousticness',
						title: 'acousticness',
						offset: { scale: 'ord', value: 'acousticness', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'danceability',
						title: 'danceability',
						offset: { scale: 'ord', value: 'danceability', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'energy',
						title: 'energy',
						offset: { scale: 'ord', value: 'energy', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'instrumentalness',
						title: 'instrumentalness',
						offset: { scale: 'ord', value: 'instrumentalness', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'liveness',
						title: 'liveness',
						offset: { scale: 'ord', value: 'liveness', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'speechiness',
						title: 'speechiness',
						offset: { scale: 'ord', value: 'speechiness', mult: -1 }
					},
					{
						orient: 'left',
						zindex: 1,
						scale: 'valence',
						title: 'valence',
						offset: { scale: 'ord', value: 'valence', mult: -1 }
					}
				],
				marks: [
					{
						type: 'group',
						from: { data: 'tracks' },
						marks: [
							{
								name: 'myline',
								type: 'line',
								from: { data: 'fields' },
								encode: {
									update: { tooltip: { signal: 'tooltip' } },
									enter: {
										x: { scale: 'ord', field: 'data' },
										y: {
											scale: { datum: 'data' },
											field: { parent: { datum: 'data' } }
										},
										stroke: { value: 'steelblue' },
										strokeWidth: { value: 3 },
										strokeOpacity: { value: 0.3 }
									}
								}
							}
						]
					}
				]
			}
		}
	},
	watch: {
		vegaSpec(v) {
			if (v) this.draw()
		}
	},
	created() {
		this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
			this.trackInfo = result.map(item => ({
				id: item.track.id,
				artists: item.track.artists.map(artist => artist.name),
				name: item.track.name
			}))
			this.$axios
				.$post('.netlify/functions/getAudioFeatures', {
					ids: result.map(item => item.track.id)
				})
				.then(result => {
					this.tracks = result
					embed('#ParallelCoordinatesTracks', this.vegaSpec, { actions: false })
				})
		})
	},
	methods: {
		async draw() {
			await embed('#ParallelCoordinatesTracks', this.vegaSpec)
		}
	}
}
</script>
