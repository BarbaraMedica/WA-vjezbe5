// pizza-express/data/data.js

export const pizze = [
  {
    id: 1,
    naziv: "Margherita",
    sastojci: ["rajčica", "sir", "bosiljak"],
    cijene: { mala: 7.30, srednja: 9.20, jumbo: 16.20 },
    slika_url: "https://pizzeria-tivoli.com.hr/uploads/pizza-margherita-u6kflo.jpg"
  },
  {
    id: 2,
    naziv: "Capricciosa",
    sastojci: ["rajčica", "sir", "šunka", "gljive"],
    cijene: { mala: 8.50, srednja: 10.50, jumbo: 17.50 },
    slika_url: "https://pizzeria-tivoli.com.hr/uploads/pizza-capricciosa-q6dxro.jpg"
  },
  {
    id: 3,
    naziv: "Al Tonno",
    sastojci: ["rajčica", "sir", "tunjevina", "crveni luk"],
    cijene: { mala: 9.00, srednja: 11.20, jumbo: 18.50 },
    slika_url: "https://pizzeria-tivoli.com.hr/uploads/pizza-al-tonno-jvvgp1.jpg"
  },
  {
    id: 4,
    naziv: "Fantasia",
    sastojci: ["rajčica", "sir", "gljive", "šunka", "paprika"],
    cijene: { mala: 8.80, srednja: 11.00, jumbo: 19.00 },
    slika_url: "https://pizzeria-tivoli.com.hr/uploads/pizza-fantasia-u6l4pa.jpg"
  },
  {
    id: 5,
    naziv: "Slavonska",
    sastojci: ["rajčica", "sir", "kulen", "panceta", "feferoni ljuti"],
    cijene: { mala: 9.50, srednja: 12.00, jumbo: 20.00 },
    slika_url: "https://pizzeria-tivoli.com.hr/uploads/pizza-salami-lxxtdy.jpg"
  }
];

export const narudzbe = [
{
id: 1,
narucene_pizze: [
// svaka narudžba sastoji se od jedne ili više naručenih pizza
{
// za svaku naručenu pizzu bilježimo naziv, naručenu veličinu i količinu
naziv: 'Margherita',
velicina: 'srednja',
kolicina: 2
},
{
    naziv: 'Fantasia',
    velicina: 'jumbo',
    kolicina: 1
}],
ukupna_cijena: 40.6, // ukupnu cijenu narudžbe računamo na poslužitelju
podaci_dostava: {
    prezime: 'Perić',
    adresa: 'Zagrebačka 15, Pula',
    telefon: '091234567'
}}];