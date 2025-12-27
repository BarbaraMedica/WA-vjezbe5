<template>
    
    <div class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
        <div class="pizza-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
            v-for="pizza in pizze"
            :key="pizza.id"
            @click="odaberiPizzu(pizza)"

            :class="[
                'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
                odabrana_pizza === pizza.naziv
                ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
                : 'hover:scale-[1.01]',
            ]"
            >
            <div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl">
                <img 
                    :src="pizza.slika_url || 'https://www.freeiconspng.com/uploads/pizza-png-1.png'" 
                    :alt="pizza.naziv" 
                    class="w-full h-full object-cover" 
                />
            </div>


            <div class="p-6">
                <div class="flex items-center space-x-3 mb-4">
                <h2 class="text-lg font-bold text-orange-500 tracking-wide">
                    {{ pizza.naziv }}
                </h2>

                <div class="flex flex-wrap gap-2 mb-4">
                    <div 
                        v-for="sastojak in pizza.sastojci" 
                        :key="sastojak"
                        class="flex items-center gap-1 bg-orange-400 text-white px-2 py-1 rounded-full text-xs"
                    >
                        <v-icon :name="ikoneSastojaka[sastojak]" /> 
                    
                    </div>
                    </div>

                </div>

                <div class="space-y-2">
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Mala</span>
                    <span>{{ pizza.cijene.mala }}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Srednja</span>
                    <span>{{ pizza.cijene.srednja }}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                    <span class="font-medium">Jumbo</span>
                    <span>{{ pizza.cijene.jumbo }}</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        <OrderFooter
                v-if="odabrana_pizza"
                :odabrana-pizza="odabrana_pizza"
                @close="odabrana_pizza = null"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { addIcons } from 'oh-vue-icons';
import OrderFooter from './OrderFooter.vue';

// uvoz potrebnih ikona
import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';

// registracija ikona koje ćemo koristiti
addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton);

    
  const ikoneSastojaka = {
    rajčica: "gi-tomato",
    sir: "gi-cheese-wedge",
    gljive: "gi-sliced-mushroom",
    bosiljak: "io-leaf-sharp",
    paprika: "gi-bell-pepper",
    šunka: "gi-ham-shank",
    'feferoni ljuti': "la-pepper-hot-solid",
    tunjevina: "gi-canned-fish",
    'crveni luk': "gi-garlic",
    panceta: "fa-bacon",
    kulen: "co-hotjar",
    vrhnje: "gi-milk-carton"
};


    const odabrana_pizza = ref(null); // reaktivna varijabla za pohranu naziva odabrane pizze
    function odaberiPizzu(pizza) {
        odabrana_pizza.value = pizza;
        console.log('Odabrana pizza:', pizza);
    }


    /*
    function odaberiPizzu(pizza_naziv) {
        odabrana_pizza.value = pizza_naziv; // postavljanje naziva odabrane pizze
        console.log('Odabrana pizza:', odabrana_pizza.value); // ispis u konzolu (provjerite)
    } 
        */
    async function fetchPizze() { 
try {
    const response = await axios.get('http://localhost:3000/pizze'); // dodajemo await kako bi sačekali odgovor asiknrone funkcije
    pizze.value = response.data; // pohrana podataka o pizzama u reaktivnu varijablu
    console.log(pizze.value); // ispisuje podatke o pizzama nakon dohvaćanja HTTP odgovora
} catch (error) {
    console.error('Greška pri dohvaćanju podataka o pizzama:', error);
}
}
// u ovom slučaju onMounted ne treba biti async zato što ne koristimo await direktno unutar njega
onMounted(() => {
fetchPizze(); // pozivanje funkcije za dohvaćanje podataka o pizzama
});
const pizze = ref([
  {
    id: 1,
    naziv: "Margherita",
    sastojci: ["rajčica", "sir", "bosiljak"],
    cijene: {
      mala: "€00.00",
      srednja: "€00.00",
      jumbo: "€00.00"
    }
  },
  {
    id: 2,
    naziv: "Capricciosa",
    sastojci: ["rajčica", "sir", "šunka", "gljive"],
    cijene: {
      mala: "€00.00",
      srednja: "€00.00",
      jumbo: "€00.00"
    }
  },
  {
    id: 3,
    naziv: "Al Tonno",
    sastojci: ["rajčica", "sir", "tunjevina", "crveni luk"],
    cijene: {
      mala: "€00.00",
      srednja: "€00.00",
      jumbo: "€00.00"
    }
  },
  {
    id: 4,
    naziv: "Fantasia",
    sastojci: ["rajčica", "sir", "gljive", "šunka", "paprika"],
    cijene: {
      mala: "€00.00",
      srednja: "€00.00",
      jumbo: "€00.00"
    }
  },
  {
    id: 5,
    naziv: "Slavonska",
    sastojci: ["rajčica", "sir", "kulen", "panceta", "feferoni ljuti"],
    cijene: {
      mala: "€00.00",
      srednja: "€00.00",
      jumbo: "€00.00"
    }
  }
]);



/*
    axios
        .get('http://localhost:3000/pizze') // slanje GET zahtjeva na /pizze endpoint
        // obrada uspješnog odgovora
        .then(response => {
            console.log(response.data); // ispisuje podatke o pizzama iz odgovora
        })
        // obrada greške
        .catch(error => {
            console.error('Greška pri dohvaćanju podataka o pizzama:', error);
        });
*/


/* iz htmla:
 
 <!-- Pizza 1 -->
                <div @click="odaberiPizzu('Margherita')">
                <div
                    :class="[
                        'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
                        odabrana_pizza === 'Margherita'
                            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
                            : 'hover:scale-[1.01]',
                        ]"
        >
                <div class="bg-inherit rounded-xl overflow-hidden">
                    <div class="w-full h-48 flex items-center justify-center bg-inherit">
                        <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image 1" class="w-full h-full object-contain" />
                </div>
            </div>

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">Margherita</h2>

                        <div class="flex space-x-2">
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>€00.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

           <!-- Pizza 2 -->
            <div @click="odaberiPizzu('Slavonska')">
                <div
                    :class="[
                        'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
                        odabrana_pizza === 'Slavonska'
                            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
                            : 'hover:scale-[1.01]',
                        ]"
                >
                    <div class="w-full h-48 flex items-center justify-center bg-inherit">
                        <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png"
                            alt="Pizza Image 2"
                            class="w-full h-full object-contain" />
                    </div>
        

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">Slavonska</h2>

                        <div class="flex space-x-2">
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>€00.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        


            <!-- Pizza 3 -->
            <div @click="odaberiPizzu('Mješana')">
                <div
                    :class="[
                        'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
                        odabrana_pizza === 'Mješana'
                            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
                            : 'hover:scale-[1.01]',
                        ]"
                        >
                <div class="bg-inherit rounded-xl overflow-hidden">
                    <div class="w-full h-48 flex items-center justify-center bg-inherit">
                        <img src="https://www.freeiconspng.com/uploads/pizza-png-1.png" alt="Pizza Image 3" class="w-full h-full object-contain" />
                </div>
            </div>

                <div class="p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <h2 class="text-lg font-bold text-orange-500 tracking-wide">Mješana</h2>

                        <div class="flex space-x-2">
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs">Icon</div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Mala</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Srednja</span>
                            <span>€00.00</span>
                        </div>

                        <div class="flex justify-between text-gray-700">
                            <span class="font-medium">Jumbo</span>
                            <span>€00.00</span>
                        </div>
                    </div>
                </div>
            </div>
*/

</script>

<style scoped>


</style>