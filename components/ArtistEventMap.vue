<template>
	<div id="ArtistEventMap"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		this.$axios.$get('/.netlify/functions/getAllArtists').then(result => {
			let artists = result.map(item => item.name)
			this.$axios
				.$post('/.netlify/functions/getAllArtistEvents', { artists: artists })
				.then(result => {
					console.log(result)
				})
		})
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json'
			}
		}
	},
	data() {
		return {
			events: []
		}
	}
}
</script>
