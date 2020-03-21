const axios = require('axios')

export async function handler(event, context) {
  let clientId = process.env.SPOTIFY_CLIENT_ID
  let clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  let b64 = Buffer.from(clientId + ':' + clientSecret).toString('base64')

  let params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')

  axios
    .post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization: 'Basic ' + b64,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(result => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: result.data.access_token })
      }
    })
}
