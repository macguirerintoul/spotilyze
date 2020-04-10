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

				signals: [
					{ name: 'tx', update: 'width / 2' },
					{ name: 'ty', update: 'height / 2' },
					{
						name: 'scale',
						value: 150,
						on: [
							{
								events: { type: 'wheel', consume: true },
								update:
									'clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)'
							}
						]
					},
					{
						name: 'angles',
						value: [0, 0],
						on: [
							{
								events: 'mousedown',
								update: '[rotateX, centerY]'
							}
						]
					},
					{
						name: 'cloned',
						value: null,
						on: [
							{
								events: 'mousedown',
								update: "copy('projection')"
							}
						]
					},
					{
						name: 'start',
						value: null,
						on: [
							{
								events: 'mousedown',
								update: 'invert(cloned, xy())'
							}
						]
					},
					{
						name: 'drag',
						value: null,
						on: [
							{
								events: '[mousedown, window:mouseup] > window:mousemove',
								update: 'invert(cloned, xy())'
							}
						]
					},
					{
						name: 'delta',
						value: null,
						on: [
							{
								events: { signal: 'drag' },
								update: '[drag[0] - start[0], start[1] - drag[1]]'
							}
						]
					},
					{
						name: 'rotateX',
						value: 0,
						on: [
							{
								events: { signal: 'delta' },
								update: 'angles[0] + delta[0]'
							}
						]
					},
					{
						name: 'centerY',
						value: 0,
						on: [
							{
								events: { signal: 'delta' },
								update: 'clamp(angles[1] + delta[1], -60, 60)'
							}
						]
					}
				],

				projections: [
					{
						name: 'projection',
						type: 'mercator',
						scale: { signal: 'scale' },
						rotate: [{ signal: 'rotateX' }, 0, 0],
						center: [0, { signal: 'centerY' }],
						translate: [{ signal: 'tx' }, { signal: 'ty' }]
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
