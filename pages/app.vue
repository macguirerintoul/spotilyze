<template>
	<div>
		<h2>Hello, {{ user.display_name }}!</h2>
		<p>Welcome to Spotilyze. It's a visual analytics app developed to provide DJs and music enthusiasts with insights about their libraries.</p>
		<h2>Assignment 4 visuals</h2>
		<ArtistPopularityDistribution />
		<p>This visual shows the distribution of artists over popularity. By choosing tracks from high-popularity artists, DJs can curate sets that crowds will love.</p>
		<ScatterPlotDanceabilityTempo />
		<p>This visual shows the correlation between danceability and tempo. Note: regression line will be added shortly.</p>
		<h2>Misc. visuals</h2>
		<ParallelCoordinatesTracks />
		<ScatterPlotDancePopularity />
		<p>This visual shows the correlation between popularity and danceability.</p>
	</div>
</template>
<script>
import ParallelCoordinatesTracks from '~/components/ParallelCoordinatesTracks'
import ScatterPlotDancePopularity from '~/components/ScatterPlotDancePopularity'
import ScatterPlotDanceabilityTempo from '~/components/ScatterPlotDanceabilityTempo'
import ArtistPopularityDistribution from '~/components/ArtistPopularityDistribution'

export default {
	components: {
		ParallelCoordinatesTracks,
		ScatterPlotDancePopularity,
		ScatterPlotDanceabilityTempo,
		ArtistPopularityDistribution
	},
	mounted() {
		this.checkIfAuthenticated()
	},
	data() {
		return {
			user: {}
		}
	},
	methods: {
		initialize() {
			console.log('Initializing app')
		},
		checkIfAuthenticated() {
			this.$axios
				.$get('https://api.spotify.com/v1/me')
				.then(result => {
					// User is already authenticated
					this.user = result
					this.initialize()
				})
				.catch(error => {
					// 401 error because user is not yet authenticated, so send them back to the home screen
					console.log('user not authenticated, redirecting to home screen')
					this.$router.push('/')
				})
		}
	}
}
</script>
