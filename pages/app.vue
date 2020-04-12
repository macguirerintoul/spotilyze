<template>
	<div class="flex-column">
		<h2>Hello, {{ user.display_name }}!</h2>
		<p>
			Welcome to Spotilyze. It's a visual analytics app developed to provide DJs
			and music enthusiasts with insights about their libraries.
		</p>

		<h3>Distribution of artists over popularity</h3>
		<p>Choose a popularity bin to get started.</p>
		<ArtistPopularityDistribution :artists="fullArtists" />

		<p>
			This visual shows the distribution of artists over popularity. By choosing
			tracks from high-popularity artists, DJs can curate sets that crowds will
			love. The visual uses the dimension 'popularity', which is an artist's
			popularity as determined by Spotify's algorithms. The artists are plotted
			on a histogram, as this allows the user to easily move from most popular
			artists to least popular. Clicking any of the bins will filter the other
			views of the data using only artists from that bin.
		</p>

		<h3>Scatter plot of danceabilty vs. popularity</h3>
		<ScatterPlotDancePopularity :artists="artists" />
		<p>
			This visual shows the correlation between popularity and danceability, and
			attempts to uncover whether songs that are more danceable will be more
			popular. To visualize the correlation (if any), we use a scatter plot of
			two dimensions: danceability and popularity. According to the regression
			line, there is no linear correlation between popularity and danceability.
		</p>

		<h3>Artist event map</h3>
		<ArtistEventMap :artists="artists" />
		<p>
			This visual shows all upcoming events for artists selected in the first
			visual. It gets a list of artists the user is following from the Spotify
			API, then uses the Bandsintown API to search for events that include those
			artists.
		</p>

		<h3>Parallel coordinates of tracks in library</h3>
		<!-- <ParallelCoordinatesTracks /> -->
		<p>
			This visual shows all tracks in the library across 7 dimensions. From this
			visualization, we can see that the user (Macguire) tends to listen to
			music that is highly danceable, as well as highly electronic.
		</p>
		<h3>Scatter plot of danceability vs. tempo</h3>
		<!-- <ScatterPlotDanceabilityTempo /> -->
		<p>
			This visual shows the correlation between danceability and tempo, and
			attempts to uncover whether danceability is correlated to tempo.
			Conventionally, dance music is in the range 120bpm - 128bpm. To visualize
			the correlation (if any), we use a scatter plot of two dimensions:
			danceability and tempo. Note: regression line will be added shortly.
		</p>
	</div>
</template>
<script>
// import ParallelCoordinatesTracks from '~/components/ParallelCoordinatesTracks'
import ScatterPlotDancePopularity from '~/components/ScatterPlotDancePopularity'
// import ScatterPlotDanceabilityTempo from '~/components/ScatterPlotDanceabilityTempo'
import ArtistPopularityDistribution from '~/components/ArtistPopularityDistribution'
import ArtistEventMap from '~/components/ArtistEventMap'

export default {
	components: {
		// ParallelCoordinatesTracks,
		ScatterPlotDancePopularity,
		ArtistPopularityDistribution,
		ArtistEventMap
		// ScatterPlotDanceabilityTempo,
	},
	created() {
		this.$axios.$get('/.netlify/functions/getAllArtists').then(result => {
			this.$axios
				.$post('/.netlify/functions/getArtistDetails', {
					ids: result.map(item => item.id)
				})
				.then(result => {
					this.fullArtists = result
				})
		})
	},
	mounted() {
		this.checkIfAuthenticated()
	},
	data() {
		return {
			user: {},
			fullArtists: [],
			minPopularity: 50,
			maxPopularity: 100
		}
	},
	computed: {
		artists() {
			return this.fullArtists
				.filter(artist => artist.popularity >= this.minPopularity)
				.filter(artist => artist.popularity <= this.maxPopularity)
		}
	},
	methods: {
		setPopularityFilter(min, max) {
			this.minPopularity = min
			this.maxPopularity = max
		},
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
					console.error(error)
					this.$router.push('/')
				})
		}
	}
}
</script>
<style scoped>
h2,
h3 {
	margin-top: 3rem;
}

.flex-column {
	display: flex;
	flex-direction: column;
	max-width: 800px;
	margin: auto;
}
</style>
