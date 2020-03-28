<template>
	<div>
		<p>Spotilyze is a cool app to analyze your spotify library</p>
		<a :href="spotifyLoginUrl">Login with Spotify</a>
	</div>
</template>

<script>
export default {
	mounted() {
		console.log('mounted', this.redirect_uri)
		this.checkIfAuthenticated()
	},
	created() {
		console.log('created', this.redirect_uri)
	},
	data() {
		return {
			scope: 'user-library-read',
			user: {},
			client_id: process.env.SPOTIFY_CLIENT_ID,
			redirect_uri: process.env.REDIRECT_URI
		}
	},
	computed: {
		spotifyLoginUrl() {
			return (
				'https://accounts.spotify.com/authorize?client_id=' +
				this.client_id +
				'&response_type=code&redirect_uri=' +
				this.redirect_uri +
				'&scope=' +
				this.scope
			)
		}
	},
	methods: {
		initialize() {
			this.$axios
				.$get('https://api.spotify.com/v1/me')
				.then(result => (this.user = result))
				.catch(error => {
					console.error(error)
				})
		},
		checkIfAuthenticated() {
			this.$axios
				.$get('https://api.spotify.com/v1/me')
				.then(result => {
					console.log('authenticated')
					// User is already authenticated
					this.$router.push('app')
					console.log(result)
				})
				.catch(error => {
					// 401 error because user is not yet authenticated
					this.getToken()
				})
		},
		getToken() {
			console.log('getToken()')
			if (this.$route.query.code != null) {
				console.log('URL has a code in it')
				let params = new URLSearchParams()
				params.append('code', this.$route.query.code)
				console.log('appending redirect uri', this.redirect_uri)
				params.append('redirect_uri', this.redirect_uri)
				params.append('scope', this.scope)
				this.$axios
					.$post('/.netlify/functions/getToken', params)
					.then(result => {
						console.log(result)
						// Set the Spotify token in the Nuxt Axios module so it will automatically be added to every request
						this.$axios.setToken(result.access_token, 'Bearer')
						console.log('nuxt axios token set')
						this.$router.push('app')
					})
			} else {
				console.log('No code')
			}
		}
	}
}
</script>
