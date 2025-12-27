<template>
  <footer
    class="fixed bottom-0 left-0 w-full z-50 bg-slate-800 text-white p-4 shadow-xl border-t border-slate-700"
  >
    <button
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
      @click="emit('close')"
    >
      x
    </button>

    <div class="flex justify-between gap-4">
      <div class="flex items-center gap-4 w-2/3">
        <img
          :src="odabranaPizza?.slika_url || 'https://www.freeiconspng.com/uploads/pizza-png-1.png'"
          :alt="odabranaPizza.naziv"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40"
        />
        <div class="flex flex-col gap-2">
          <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
            {{ odabranaPizza.naziv }}
          </h3>

          <!-- veličine i cijene -->
          <div class="flex items-center flex-wrap gap-2">
            <button
              v-for="(cijena, velicina) in odabranaPizza.cijene"
              :key="velicina"
              @click="odabranaVelicina = velicina"
              :class="[
                'px-3 py-1 rounded-lg border text-sm sm:text-base transition-all cursor-pointer',
                odabranaVelicina === velicina
                  ? 'bg-orange-500 text-white border-orange-400'
                  : 'bg-slate-600/40 text-white border-slate-500 hover:bg-orange-500'
              ]"
            >
              {{ velicina }} - {{ cijena }}€
            </button>
          </div>

          <div class="flex items-center gap-3 mt-2">
            <button @click="smanjiKolicinu" class="px-3 py-1 rounded bg-slate-600 hover:bg-orange-500">–</button>
            <span class="min-w-[20px] text-center font-semibold">{{ kolicina }}</span>
            <button @click="povecajKolicinu" class="px-3 py-1 rounded bg-slate-600 hover:bg-orange-500">+</button>
          </div>

          <div class="font-semibold text-lg text-orange-400 tracking-wide mt-2">
            Ukupno: {{ ukupnaCijena }} €
          </div>

          <button @click="dodajUNarudzbu" class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Dodaj u košaricu
          </button>

          <!-- prikaz pizza -->
          <div v-if="narucene_pizze.length" class="mt-2 space-y-2">
            <div
              v-for="(pizza, index) in narucene_pizze"
              :key="index"
              class="flex justify-between bg-slate-700 p-2 rounded items-center"
            >
              <span>{{ pizza.naziv }} ({{ pizza.velicina }}) x{{ pizza.kolicina }}</span>
              <button @click="obrisiStavku(index)" class="text-red-400 font-bold">X</button>
            </div>
          </div>
        </div>
      </div>

      <!--podaci za dostavu -->
      <div class="mt-4 p-3 bg-slate-700 rounded-lg space-y-2 w-1/3 flex-shrink-0">
        <h4 class="text-white font-semibold">Podaci za dostavu:</h4>
        <input v-model="prezime" type="text" placeholder="Prezime" class="w-full px-3 py-2 rounded bg-slate-600 text-white" />
        <input v-model="adresa" type="text" placeholder="Adresa" class="w-full px-3 py-2 rounded bg-slate-600 text-white" />
        <input v-model="telefon" type="text" placeholder="Telefon" class="w-full px-3 py-2 rounded bg-slate-600 text-white" />

        <button
          @click="posaljiNarudzbu"
          class="mt-2 w-full bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide"
        >
          Naruči
        </button>

        <div v-if="statusNarudzbe" class="mt-3 text-center font-semibold text-white bg-slate-700 rounded-lg p-2">
          {{ statusNarudzbe }}
        </div>
      </div>
    </div>
  </footer>
</template>


<script setup>
import { ref, computed } from 'vue'
import axios from 'axios';

const prezime = ref('');
const adresa = ref('');
const telefon = ref('');
const statusNarudzbe = ref('');



const props = defineProps({
  odabranaPizza: Object
})

const emit = defineEmits(['close'])

const odabranaVelicina = ref('mala')
const kolicina = ref(1)
const narucene_pizze = ref([])

function dodajUNarudzbu() {
  narucene_pizze.value.push({
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value
  });
  kolicina.value = 1;
}

function obrisiStavku(index) {
  narucene_pizze.value.splice(index, 1);
}

function povecajKolicinu() {
  kolicina.value++;
}

function smanjiKolicinu() {
  if (kolicina.value > 1) kolicina.value--;
}

const ukupnaCijena = computed(() => {
  return (
    props.odabranaPizza.cijene[odabranaVelicina.value] * kolicina.value
  ).toFixed(2);
});

async function posaljiNarudzbu() {
  if (!narucene_pizze.value.length) {
    statusNarudzbe.value = 'Košarica je prazna.';
    return;
  }

  if (!prezime.value || !adresa.value || !telefon.value) {
    statusNarudzbe.value = 'Molimo unesite sve podatke za dostavu.';
    return;
  }

  try {
    const res = await axios.post('http://localhost:3000/narudzbe', {
      narucene_pizze: narucene_pizze.value,
      podaci_dostava: {
        prezime: prezime.value,
        adresa: adresa.value,
        telefon: telefon.value
      }
    });

    statusNarudzbe.value = res.data.status;
    narucene_pizze.value = [];
    prezime.value = adresa.value = telefon.value = '';
  } catch {
    statusNarudzbe.value = 'Greška pri slanju narudžbe.';
  }
}

</script>

<style scoped>
</style>
