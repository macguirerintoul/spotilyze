const axios = require('axios')

const getAllArtistEvents = async artists => {
	let promises = []
	let events = []

	for (i = 0; i < artists.length; i++) {
		promises.push(
			axios
				.get(
					'https://rest.bandsintown.com/artists/' +
						escape(artists[i]) +
						'/events?app_id=' +
						process.env.BANDSINTOWN_APP_ID +
						'&date=upcoming'
				)
				.then(result => {
					events.push.apply(events, result)
				})
		)
	}
	return Promise.all(promises).then(() => {
		return events
	})
}

exports.handler = async event => {
	console.log('getAllArtistEvents')
	const artists = JSON.parse(event.body).artists

	return getAllArtistEvents(artists).then(result => {
		console.log(result)
		return {
			statusCode: 200,
			body: JSON.stringify(result)
		}
	})
}
