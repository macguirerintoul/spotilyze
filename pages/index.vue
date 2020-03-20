<template>
  <div>
    <a
      href="https://accounts.spotify.com/authorize?client_id=5258eb9bfe354fef94b82e9f53630b35&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000"
      >Login with Spotify</a
    >
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    authorize() {
      axios
        .get('https://accounts.spotify.com/authorize', {
          params: {
            client_id: '5258eb9bfe354fef94b82e9f53630b35',
            response_type: 'code',
            redirect_uri: 'localhost:3000'
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>

<style></style>
