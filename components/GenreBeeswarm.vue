<template>
	<div id="GenreBeeswarm"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		console.log('created')
		this.$axios.$get('/.netlify/functions/getAllArtists').then(result => {
			console.log(result)
			this.artists = result
			embed('#GenreBeeswarm', this.vegaSpec, { actions: false })
		})
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json',
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
								type: 'line',
								from: { data: 'fields' },
								encode: {
									enter: {
										x: { scale: 'ord', field: 'data' },
										y: {
											scale: { datum: 'data' },
											field: { parent: { datum: 'data' } }
										},
										stroke: { value: 'steelblue' },
										strokeWidth: { value: 1.01 },
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
	data() {
		return {
			tracks: []
		}
	}
}
</script>
