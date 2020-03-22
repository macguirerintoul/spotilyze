<template>
  <div>
    <h2>Hello, {{ user.display_name }}!</h2>
    <AlbumsOverTime />
    <ParallelCoordinatesTracks />
  </div>
</template>
<script>
// TODO use nuxt builtin axios
import axios from 'axios'
import AlbumsOverTime from '~/components/AlbumsOverTime'
import ParallelCoordinatesTracks from '~/components/ParallelCoordinatesTracks'
export default {
  components: { AlbumsOverTime, ParallelCoordinatesTracks },
  created() {
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
          this.$router.push('/')
        })
    }
  }
}
</script>
