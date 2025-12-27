import express from 'express';
import { ObjectId } from 'mongodb';

export default function narudzbeRouter(db) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const narudzbe_collection = db.collection('narudzbe');
            const narudzbe = await narudzbe_collection.find().toArray();
            
            if (narudzbe.length === 0) {
                return res.status(404).json({ error: 'Nema narudžbi' });
            }
            
            res.status(200).json(narudzbe);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Greška pri dohvaćanju narudžbi' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const narudzbe_collection = db.collection('narudzbe');
            const id_param = req.params.id;
            const narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) });
            
            if (!narudzba) {
                return res.status(404).json({ error: 'Narudžba nije pronađena' });
            }
            
            res.status(200).json(narudzba);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Greška pri dohvaćanju narudžbe' });
        }
    });

    // post i valid
    router.post('/', async (req, res) => {
        try {
            const narudzbe_collection = db.collection('narudzbe');
            const pizze_collection = db.collection('pizze');
            const novaNarudzba = req.body;
            
            const obavezniKljucevi = ['ime', 'adresa', 'telefon', 'narucene_pizze'];
            const obavezniKljuceviStavke = ['naziv', 'kolicina', 'velicina'];
            
            if (!obavezniKljucevi.every(kljuc => kljuc in novaNarudzba)) {
                return res.status(400).json({ error: 'Nedostaju obavezni ključevi: ime, adresa, telefon, narucene_pizze' });
            }
            
            
            if (!novaNarudzba.narucene_pizze.every(stavka => 
                obavezniKljuceviStavke.every(kljuc => kljuc in stavka))) {
                return res.status(400).json({ error: 'Nedostaju obavezni ključevi u stavci narudžbe: naziv, kolicina, velicina' });
            }
            
            // validacije 
            const telefonString = String(novaNarudzba.telefon).replace(/\s/g, ''); 
            if (!/^\d+$/.test(telefonString)) {
                return res.status(400).json({ error: 'Telefon mora sadržavati samo brojeve' });
            }
            
            
            if (!novaNarudzba.narucene_pizze.every(stavka => {
                return Number.isInteger(stavka.kolicina) && 
                       stavka.kolicina > 0 && 
                       ['mala', 'srednja', 'jumbo'].includes(stavka.velicina);
            })) {
                return res.status(400).json({ error: 'Neispravni podaci: količina mora biti pozitivan cijeli broj, veličina mora biti mala/srednja/jumbo' });
            }
            
            const dostupne_pizze = await pizze_collection.find().toArray();
            if (!novaNarudzba.narucene_pizze.every(stavka => 
                dostupne_pizze.some(pizza => pizza.naziv === stavka.naziv))) {
                return res.status(400).json({ error: 'Odabrali ste pizzu koju nemamo u ponudi' });
            }
            
            let ukupna_cijena = 0;
            
            for (const stavka of novaNarudzba.narucene_pizze) {
                const pizza = await pizze_collection.findOne({ naziv: stavka.naziv });
                
                if (pizza && pizza.cijene && pizza.cijene[stavka.velicina]) {
                    ukupna_cijena += pizza.cijene[stavka.velicina] * stavka.kolicina;
                }
            }
            
            novaNarudzba.ukupna_cijena = parseFloat(ukupna_cijena.toFixed(2));
            
            const result = await narudzbe_collection.insertOne(novaNarudzba);
            res.status(201).json({ 
                insertedId: result.insertedId,
                ukupna_cijena: novaNarudzba.ukupna_cijena
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message || 'Greška pri dodavanju narudžbe' });
        }
    });

    router.patch('/:id', async (req, res) => {
        try {
            const narudzbe_collection = db.collection('narudzbe');
            const id_param = req.params.id;
            const noviStatus = req.body.status;
            
            const result = await narudzbe_collection.updateOne(
                { _id: new ObjectId(id_param) }, 
                { $set: { status: noviStatus } }
            );
            
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Narudžba nije pronađena' });
            }
            
            res.status(200).json({ modifiedCount: result.modifiedCount });
        } catch (error) {
            console.log(error.errorResponse);
            res.status(400).json({ error: error.errorResponse });
        }
    });

    return router;
}