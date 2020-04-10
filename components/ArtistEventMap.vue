<template>
	<div id="ArtistEventMap"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
	created() {
		this.$axios.$get('/.netlify/functions/getAllArtists').then(result => {
			let artists = result.map(item => item.name)
			this.$axios
				.$post('/.netlify/functions/getAllArtistEvents', { artists: artists })
				.then(result => {
					console.log(result)
					this.events = result
					embed('#ArtistEventMap', this.vegaSpec)
				})
		})
	},
	computed: {
		vegaSpec() {
			return {
				$schema: 'https://vega.github.io/schema/vega/v5.json',
				description: 'A configurable map of countries of the world.',
				width: 900,
				height: 500,
				autosize: 'none',

				projections: [
					{
						name: 'projection',
						type: 'mercator'
					}
				],

				data: [
					{
						name: 'world',
						url:
							'https://raw.githubusercontent.com/vega/vega/master/docs/data/world-110m.json',
						format: {
							type: 'topojson',
							feature: 'countries'
						}
					},
					{
						name: 'graticule',
						transform: [{ type: 'graticule' }]
					},
					{
						name: 'events',
						values: this.events,
						transform: [
							{
								type: 'geopoint',
								projection: 'projection',
								fields: ['venue.longitude', 'venue.latitude']
							},
							{
								type: 'filter',
								expr: 'datum.x != null && datum.y != null'
							}
						]
					}
				],

				marks: [
					{
						type: 'shape',
						from: { data: 'world' },
						encode: {
							strokeWidth: 5,
							stroke: '#000',
							fill: '#fff'
						},
						transform: [{ type: 'geoshape', projection: 'projection' }]
					},
					{
						type: 'symbol',
						from: { data: 'events' },
						encode: {
							enter: {
								size: { value: 16 },
								fill: { value: 'steelblue' },
								fillOpacity: { value: 0.8 },
								stroke: { value: 'white' },
								strokeWidth: { value: 1.5 }
							},
							update: {
								x: { field: 'x' },
								y: { field: 'y' }
							}
						}
					}
				]
			}
		}
	},
	data() {
		return {
			events: []
		}
	}
}
</script>
