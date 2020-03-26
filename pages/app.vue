<template>
	<div>
		<h2>Hello, {{ user.display_name }}!</h2>
		<ParallelCoordinatesTracks />
		<ScatterPlotDancePopularity />
		<ArtistPopularityDistribution />
	</div>
</template>
<script>
import ParallelCoordinatesTracks from '~/components/ParallelCoordinatesTracks'
import ScatterPlotDancePopularity from '~/components/ScatterPlotDancePopularity'
import ArtistPopularityDistribution from '~/components/ArtistPopularityDistribution'

export default {
	components: {
		ParallelCoordinatesTracks,
		ScatterPlotDancePopularity,
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
