<template>
  <div>
    {{ b.num }}
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import gsap from "gsap";

const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const b = reactive({
  num: 0,
});


function AnimateToValue() {
  gsap.to(b, {
    duration: 0.5,
    num: props.value
  })
}
AnimateToValue()




watch(() => props.value, () => AnimateToValue())
</script>

<style  scoped>

</style>