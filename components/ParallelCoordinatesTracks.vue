<template>
  <div id="viz"></div>
</template>
<script>
import embed from 'vega-embed'

export default {
  created() {
    this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
      this.$axios
        .$post('.netlify/functions/getAudioFeatures', { ids: result })
        .then(result => {
          console.log(result)
          this.tracks = result
        })
    })
  },
  async mounted() {
    await embed('#viz', this.vegaSpec, { actions: false })
  },
  computed: {
    vegaSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        width: 400,
        height: 200,
        padding: 5,

        data: [
          {
            name: 'table',
            values: [
              { category: 'A', amount: 28 },
              { category: 'B', amount: 55 },
              { category: 'C', amount: 43 },
              { category: 'D', amount: 91 },
              { category: 'E', amount: 81 },
              { category: 'F', amount: 53 },
              { category: 'G', amount: 19 },
              { category: 'H', amount: 87 }
            ]
          }
        ],

        signals: [
          {
            name: 'tooltip',
            value: {},
            on: [
              { events: 'rect:mouseover', update: 'datum' },
              { events: 'rect:mouseout', update: '{}' }
            ]
          }
        ],

        scales: [
          {
            name: 'xscale',
            type: 'band',
            domain: { data: 'table', field: 'category' },
            range: 'width',
            padding: 0.05,
            round: true
          },
          {
            name: 'yscale',
            domain: { data: 'table', field: 'amount' },
            nice: true,
            range: 'height'
          }
        ],

        axes: [
          { orient: 'bottom', scale: 'xscale' },
          { orient: 'left', scale: 'yscale' }
        ],

        marks: [
          {
            type: 'rect',
            from: { data: 'table' },
            encode: {
              enter: {
                x: { scale: 'xscale', field: 'category' },
                width: { scale: 'xscale', band: 1 },
                y: { scale: 'yscale', field: 'amount' },
                y2: { scale: 'yscale', value: 0 }
              },
              update: {
                fill: { value: 'steelblue' }
              },
              hover: {
                fill: { value: 'red' }
              }
            }
          },
          {
            type: 'text',
            encode: {
              enter: {
                align: { value: 'center' },
                baseline: { value: 'bottom' },
                fill: { value: '#333' }
              },
              update: {
                x: { scale: 'xscale', signal: 'tooltip.category', band: 0.5 },
                y: { scale: 'yscale', signal: 'tooltip.amount', offset: -2 },
                text: { signal: 'tooltip.amount' },
                fillOpacity: [
                  { test: 'isNaN(tooltip.amount)', value: 0 },
                  { value: 1 }
                ]
              }
            }
          }
        ]
      }
    },
    vegaData() {
      return [
        {
          name: 'tracks',
          values: this.tracks,
          async: true,
          format: { type: 'json', parse: 'auto' }
        },
        {
          name: 'fields',
          values: [
            'acousticness',
            'danceability',
            'energy',
            'instrumentalness',
            'liveness',
            'speechiness',
            'valence'
          ]
        }
      ]
    }
  },
  data() {
    return {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 800,
      height: 800,
      padding: 5,
      config: {
        axisY: {
          titleX: -2,
          titleY: 410,
          titleAngle: 0,
          titleAlign: 'right',
          titleBaseline: 'top'
        }
      },
      tracks: [],
      scales: [
        {
          name: 'ord',
          type: 'point',
          range: 'width',
          round: true,
          domain: { data: 'fields', field: 'data' }
        }
      ],
      axes: [
        {
          orient: 'left',
          zindex: 1,
          scale: 'acousticness',
          title: 'acousticness',
          offset: { scale: 'ord', value: 'acousticness', mult: -1 }
        }
      ],
      marks: [
        {
          type: 'group',
          from: { data: 'tracks' },
          marks: [
            {
              type: 'line',
              from: { data: 'fields' },
              encode: {
                enter: {
                  x: { scale: 'ord', field: 'data' },
                  y: {
                    scale: { datum: 'data' },
                    field: { parent: { datum: 'data' } }
                  },
                  stroke: { value: 'steelblue' },
                  strokeWidth: { value: 1.01 },
                  strokeOpacity: { value: 0.3 }
                }
              }
            }
          ]
        }
      ]
    }
  }
}
</script>
