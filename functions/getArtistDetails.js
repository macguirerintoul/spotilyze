const axios = require('axios')

const getArtistDetails = async (ids, auth) => {
	console.log('getArtistDetails')
	let promises = []
	let artists = []

	while (ids.length > 0) {
		let chunk = ids.splice(0, 50)
		let params = new URLSearchParams()
		params.append('ids', chunk)
		promises.push(
			axios
				.get('https://api.spotify.com/v1/artists', {
					params: params,
					headers: {
						Authorization: auth
					}
				})
				.then(result => {
					let newArtists = result.data.artists
					artists.push.apply(artists, newArtists)
				})
		)
	}
	return Promise.all(promises).then(() => {
		return artists
	})
}

exports.handler = async event => {
	console.log('getArtistDetails')
	const auth = event.headers.authorization
	const ids = JSON.parse(event.body).ids

	return getArtistDetails(ids, auth).then(result => {
		return {
			statusCode: 200,
			body: JSON.stringify(result)
		}
	})
}
