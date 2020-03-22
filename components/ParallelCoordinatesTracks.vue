<template>
  <vega-lite
    :$schema="$schema"
    :width="width"
    :height="height"
    :padding="padding"
    :config="config"
    :data="vegaData"
    :marks="marks"
    :axes="axes"
    :scales="scales"
  />
</template>
<script>
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
  computed: {
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
