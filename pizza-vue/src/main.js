import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { 
  GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, 
  GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, 
  GiGarlic, FaBacon, GiHamShank 
} from 'oh-vue-icons/icons'

// Registracija ikona
addIcons(
  GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, 
  GiHamShank, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton
)

const app = createApp(App)

// Registracija globalnog komponente za ikone
app.component('v-icon', OhVueIcon)

app.use(router)
app.mount('#app')
