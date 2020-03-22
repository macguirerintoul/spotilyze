<template>
  <vega-lite :data="values" mark="bar" :encoding="encoding" />
</template>
<script>
export default {
  created() {
    this.$axios.$get('/.netlify/functions/getAllTracks').then(result => {
      this.$axios
        .$post('.netlify/functions/getAudioFeatures', { ids: result })
        .then(result => {
          console.log(result)
        })
    })
  },
  data() {
    return {
      values: [
        { val: 1 },
        { val: 5 },
        { val: 3 },
        { val: 4 },
        { val: 5 },
        { val: 6 },
        { val: 7 },
        { val: 8 },
        { val: 9 }
      ],
      encoding: {
        x: { bin: true, field: 'val', type: 'quantitative' },
        y: { aggregate: 'count', type: 'quantitative' }
      }
    }
  }
}
</script>
