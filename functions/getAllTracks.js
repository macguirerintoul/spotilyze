const axios = require('axios')

exports.handler = async event => {
  console.log('getAllTracks')

  return axios
    .get('https://api.spotify.com/v1/me/tracks', {
      // make an initial request to find out the total number of tracks in the library
      headers: {
        Authorization: event.headers.authorization
      }
    })
    .then(result => {
      // once we know the total number, retrieve every track
      const total = result.data.total
      let tracks = []

      for (i = 0; i < total; i = i + 50) {
        console.log(i)
        axios
          .get('https://api.spotify.com/v1/me/tracks?limit=50&offset=' + i, {
            headers: {
              Authorization: event.headers.authorization
            }
          })
          .then(result => {
            let newTracks = result.data.items.map(item => item.track.name)
            tracks.push.apply(tracks, newTracks)
          })
      }

      console.log(tracks)
      console.log('returning')
      return {
        statusCode: 200,
        body: JSON.stringify(tracks)
      }
    })
    .catch(error => console.error(error))
}
