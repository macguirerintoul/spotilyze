const axios = require('axios')

const getAllArtists = async (total, auth) => {
	let artists = []
	let promises = []
	// TODO use the function?
	for (i = 0; i < total; i = i + 50) {
		promises.push(
			axios
				.get('https://api.spotify.com/v1/me/tracks?limit=50&offset=' + i, {
					headers: {
						Authorization: auth
					}
				})
				.then(result => {
					let newArtistArrays = result.data.items.map(
						item => item.track.artists
					)
					let newArtists = [].concat.apply([], newArtistArrays)
					artists.push.apply(artists, newArtists)
				})
		)
	}
	return Promise.all(promises).then(() => {
		// remove duplicates
		let uniqueArtists = artists.filter(
			(artist, index, self) => index === self.findIndex(t => t.id === artist.id)
		)
		return uniqueArtists
	})
}

exports.handler = async event => {
	console.log('getAllArtists')
	const auth = event.headers.authorization
	const total = await axios
		.get('https://api.spotify.com/v1/me/tracks', {
			// make an initial request to find out all the tracks in a user's library
			headers: {
				Authorization: auth
			}
		})
		.then(result => {
			return result.data.total
		})
		.catch(error => console.error(error))

	// once we know the total number, retrieve every track
	return getAllArtists(total, auth).then(result => {
		// console.log(result)
		return {
			statusCode: 200,
			body: JSON.stringify(result)
		}
	})
}
