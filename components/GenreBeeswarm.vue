<template>
	<div id="GenreBeeswarm"></div>
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
					embed('#GenreBeeswarm', this.vegaSpec, { actions: false })
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
					}
				],
				scales: [
					{
						name: 'xscale',
						type: 'band',
						domain: {
							data: 'artists',
							field: 'genres',
							sort: true
						},
						range: 'width'
					},
					{
						name: 'color',
						type: 'ordinal',
						domain: { data: 'people', field: 'group' },
						range: { scheme: 'category20c' }
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
			artists: []
		}
	}
}
</script>
