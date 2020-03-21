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
    if (this.$route.query.code != null) {
      this.getToken()
    }
  },
  data() {
    return {
      client_id: '5258eb9bfe354fef94b82e9f53630b35',
      redirect_uri: 'http%3A%2F%2Flocalhost%3A3000'
    }
  },
  methods: {
    getToken() {
      axios.post(
        '/.netlify/functions/getToken',
        qs.stringify({
          grant_type: 'authorization_code',
          code: this.$route.query.code,
          redirect_uri: this.redirect_uri
        })
      )
    }
  }
}
</script>
<style></style>
