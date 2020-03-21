const axios = require('axios')
const querystring = require('querystring')

exports.handler = async (event, context) => {
  const body = querystring.parse(event.body)
  const code = body.code
  const redirect_uri = body.redirect_uri

  if (code == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No code provided' })
    }
  }

  let clientId = process.env.SPOTIFY_CLIENT_ID
  let clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  let b64 = Buffer.from(clientId + ':' + clientSecret).toString('base64')

  let params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('redirect_uri', redirect_uri)
  params.append('code', code)
  return axios
    .post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization: 'Basic ' + b64,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(result => {
      return {
        statusCode: 200,
        body: JSON.stringify(result.data)
      }
    })
    .catch(error => console.error(error))
}
