const axios = require('axios')

const getAllAudioFeatures = async (ids, auth) => {
	console.log('getAllAudioFeatures')
	let promises = []
	let tracks = []
	while (ids.length > 0) {
		let chunk = ids.splice(0, 100)
		let params = new URLSearchParams()
		params.append('ids', chunk)
		promises.push(
			axios
				.get('https://api.spotify.com/v1/audio-features', {
					params: params,
					headers: {
						Authorization: auth,
					},
				})
				.then(result => {
					let newTracks = result.data.audio_features
					tracks.push.apply(tracks, newTracks)
				})
		)
	}
	return Promise.all(promises).then(() => {
		return tracks
	})
}

exports.handler = async event => {
	console.log('getAudioFeatures')
	const auth = event.headers.authorization
	const ids = JSON.parse(event.body).ids

	return getAllAudioFeatures(ids, auth).then(result => {
		return {
			statusCode: 200,
			body: JSON.stringify(result),
		}
	})
}
