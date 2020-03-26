const axios = require('axios')

const getAllTracks = async (total, auth) => {
	let tracks = []
	let promises = []
	for (i = 0; i < total; i = i + 50) {
		promises.push(
			axios
				.get('https://api.spotify.com/v1/me/tracks?limit=50&offset=' + i, {
					headers: {
						Authorization: auth
					}
				})
				.then(result => {
					let newTracks = result.data.items
					tracks.push.apply(tracks, newTracks)
				})
		)
	}
	return Promise.all(promises).then(() => {
		// console.log('all promises resolved')
		return tracks
	})
}

exports.handler = async event => {
	console.log('getAllTracks')
	const auth = event.headers.authorization
	const total = await axios
		.get('https://api.spotify.com/v1/me/tracks', {
			// make an initial request to find out the total number of tracks in the library
			headers: {
				Authorization: auth
			}
		})
		.then(result => {
			return result.data.total
		})
		.catch(error => console.error(error))

	// once we know the total number, retrieve every track
	return getAllTracks(total, auth).then(result => {
		// console.log(result)
		return {
			statusCode: 200,
			body: JSON.stringify(result)
		}
	})
}
