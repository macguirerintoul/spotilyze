<template>
	<div class="flex-column">
		<h2>Overview</h2>
		<p>
			Welcome to Spotilyze. It's a visual analytics app developed to provide DJs
			with insights about their music libraries, as well as help them choose
			music for their performances.
		</p>
		<p>
			The visualizations are based on artist popularity. For example, a pop DJ
			playing a set at Coachella may want to choose tracks from artists that are
			popular and that the crowd is likely to enjoy. However, a DJ who prefers
			more obscure music might choose artists who are not popular, and attempt
			to surprise their audience with music they have never heard before.
		</p>
		<h2>Analytical questions</h2>
		<p>
			The project is primarily based on allowing the user to explore their data
			rather than answering analytical questions. However, one analytical
			question that is answered in the visualizations is "Is there a correlation
			between popularity and danceability?" Perhaps songs become more popular if
			they are easier to dance to. However, the visual below shows that is not
			the case.
		</p>
		<h2>Data</h2>
		<p>
			The app connects directly to the Spotify and Bandsintown APIs. The APIs
			provide numerous data dimensions, but the ones used in the application are
			mostly the quantitative dimensions like popularity.
		</p>

		<h2>Interactions</h2>
		<p>
			To interact with the visuals, first select a popularity bin from the
			popularity distribution visual by clicking on it. Then, you can hover the
			data points in each subsequent visual for more information.
		</p>

		<h2>Design rationale</h2>
		<p>
			The design rationale for each visualization is provided underneath it.
		</p>

		<h3>Distribution of artists over popularity</h3>
		<p>
			Choose a popularity bin to get started. Clicking any of the bins will
			filter the other views of the data using only artists from that bin.
		</p>
		<ArtistPopularityDistribution :artists="fullArtists" />
		<caption>
			This visual shows the distribution of artists over popularity. By choosing
			tracks from high-popularity artists, DJs can curate sets that crowds will
			love. The visual uses the dimension 'popularity', which is an artist's
			popularity as determined by Spotify's algorithms. The artists are plotted
			on a histogram, as this allows the user to easily move from most popular
			artists to least popular.
		</caption>

		<h3>Scatter plot of danceabilty vs. popularity</h3>
		<ScatterPlotDancePopularity :artists="artists" />
		<p>
			Hover a data point to see details about the track. This visual shows all
			tracks for artists selected in the first visual. This visual shows the
			correlation between popularity and danceability, and attempts to uncover
			whether songs that are more danceable will be more popular. To visualize
			the correlation (if any), we use a scatter plot of two dimensions:
			danceability and popularity. According to the regression line, there is no
			linear correlation between popularity and danceability.
		</p>

		<h3>Artist event map</h3>
		<ArtistEventMap :artists="artists" />
		<p>
			Hover a data point to see details about the event. This visual shows all
			upcoming events for artists selected in the first visual. It gets a list
			of artists the user is following from the Spotify API, then uses the
			Bandsintown API to search for events that include those artists.
		</p>

		<h3>Parallel coordinates of tracks in library</h3>
		<ParallelCoordinatesTracks :artists="artists" />
		<p>
			Hover a line (where it crosses each vertical axis) to see more info. This
			visual shows all tracks in the library across 7 dimensions. This visual
			shows all tracks for artists selected in the first visual. From this
			visualization, we can see that the user (Macguire) tends to listen to
			music that is highly danceable, as well as highly electronic.
		</p>
	</div>
</template>
<script>
import ParallelCoordinatesTracks from '~/components/ParallelCoordinatesTracks'
import ScatterPlotDancePopularity from '~/components/ScatterPlotDancePopularity'
import ArtistPopularityDistribution from '~/components/ArtistPopularityDistribution'
import ArtistEventMap from '~/components/ArtistEventMap'

export default {
	components: {
		ParallelCoordinatesTracks,
		ScatterPlotDancePopularity,
		ArtistPopularityDistribution,
		ArtistEventMap
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
p {
	margin-bottom: 2rem;
}
.flex-column {
	display: flex;
	flex-direction: column;
	max-width: 800px;
	margin: auto;
}
</style>
