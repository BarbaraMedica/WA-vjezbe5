<template>
  <div class="p-6 text-white">
    <button @click="$router.push('/')"
            class="mb-4 text-orange-400 underline">
      ← Natrag na popis
    </button>

    <h1 class="text-2xl font-bold text-orange-400">
      {{ pizza?.naziv }}
    </h1>

    <p class="mt-2">{{ pizza?.opis }}</p>

    <OrderFooter
      v-if="pizza"
      :odabranaPizza="pizza"
      @close="() => {}"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import OrderFooter from '@/components/OrderFooter.vue'

const route = useRoute()
const pizza = ref(null)

onMounted(async () => {
  const res = await axios.get(
    `http://localhost:3000/pizze/${route.params.naziv}`
  )
  pizza.value = res.data
})
</script>
<style scoped></style>