<template>
  <div>
    <p>Spotilyze is a cool app to analyze your spotify library</p>
    <a :href="spotifyLoginUrl">Login with Spotify</a>
  </div>
</template>
<script>
// TODO use nuxt builtin axios
import axios from 'axios'
export default {
  created() {
    this.checkIfAuthenticated()
  },
  data() {
    return {
      user: {},
      // TODO take from .env
      client_id: '5258eb9bfe354fef94b82e9f53630b35',
      // change 8888 to whatever port netlify dev is using
      // redirect_uri: 'http%3A%2F%2Flocalhost%3A8888'
      // TODO take from .env
      redirect_uri: 'http://localhost:8888'
    }
  },
  computed: {
    spotifyLoginUrl() {
      return (
        'https://accounts.spotify.com/authorize?client_id=' +
        this.client_id +
        '&response_type=code&redirect_uri=' +
        this.redirect_uri
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
        params.append('redirect_uri', this.redirect_uri)
        axios.post('/.netlify/functions/getToken', params).then(result => {
          // Set the Spotify token in the Nuxt Axios module so it will automatically be added to every request
          this.$axios.setToken(result.data.access_token, 'Bearer')
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
