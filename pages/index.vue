<template>
  <div>
    <a
      :href="
        'https://accounts.spotify.com/authorize?client_id=' +
          client_id +
          '&response_type=code&redirect_uri=' +
          redirect_uri
      "
      >Login with Spotify</a
    >
    <button @click="getToken">get token</button>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
export default {
  created() {
    this.getToken()
  },
  data() {
    return {
      client_id: '5258eb9bfe354fef94b82e9f53630b35',
      // change 8888 to whatever port netlify dev is using
      // redirect_uri: 'http%3A%2F%2Flocalhost%3A8888'
      redirect_uri: 'http://localhost:8888'
    }
  },
  methods: {
    getToken() {
      console.log('getToken()')
      if (this.$route.query.code != null) {
        console.log('URL has a code in it')
        let params = new URLSearchParams()
        params.append('code', this.$route.query.code)
        params.append('redirect_uri', this.redirect_uri)
        axios.post('/.netlify/functions/getToken', params).then(result => {
          console.log(result)
        })
      } else {
        console.log('No code')
      }
    }
  }
}
</script>
<style></style>
