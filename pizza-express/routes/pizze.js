import express from 'express';

export default function pizzeRouter(db) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const pizze_collection = db.collection('pizze');
            
            // filter
            let filter = {};
            
            if (req.query.naziv) {
                filter.naziv = { $regex: req.query.naziv, $options: 'i' }; // case-insensitive
            }
            
            if (req.query.cijena_min || req.query.cijena_max) {
                filter.cijena = {};
                if (req.query.cijena_min) {
                    filter.cijena.$gte = parseFloat(req.query.cijena_min);
                }
                if (req.query.cijena_max) {
                    filter.cijena.$lte = parseFloat(req.query.cijena_max);
                }
            }

            let sort = {};
            if (req.query.sort === 'asc') {
                sort.cijena = 1; // uzlazno
            } else if (req.query.sort === 'desc') {
                sort.cijena = -1; // silazno
            }
            
            let cursor = pizze_collection.find(filter);
            
            if (Object.keys(sort).length > 0) {
                cursor = cursor.sort(sort);
            }
            
            const allPizze = await cursor.toArray();
            res.status(200).json(allPizze);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Greška pri dohvaćanju pizza' });
        }
    });

    router.get('/:naziv', async (req, res) => {
        try {
            const naziv_param = req.params.naziv;
            const pizze_collection = db.collection('pizze');
            const pizza = await pizze_collection.findOne({ naziv: naziv_param });
            
            if (!pizza) {
                return res.status(404).json({ message: 'Pizza nije pronađena' });
            }
            
            res.status(200).json(pizza);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Greška pri dohvaćanju pizze' });
        }
    });

    // post valid
    router.post('/', async (req, res) => {
        try {
            const pizze_collection = db.collection('pizze');
            const novaPizza = req.body;
            
            const obavezniKljucevi = ['naziv', 'cijena', 'sastojci', 'slika_url', 'cijene'];
            
            if (!obavezniKljucevi.every(kljuc => kljuc in novaPizza)) {
                return res.status(400).json({ error: 'Nedostaju obavezni ključevi: naziv, cijena, sastojci, slika_url, cijene' });
            }

            if (typeof novaPizza.cijena !== 'number' || novaPizza.cijena <= 0) {
                return res.status(400).json({ error: 'Cijena mora biti pozitivan broj' });
            }
            
            if (!Array.isArray(novaPizza.sastojci) || 
                !novaPizza.sastojci.every(sastojak => typeof sastojak === 'string')) {
                return res.status(400).json({ error: 'Sastojci moraju biti polje stringova' });
            }
            

            if (typeof novaPizza.cijene !== 'object' || 
                !('mala' in novaPizza.cijene) || 
                !('srednja' in novaPizza.cijene) || 
                !('jumbo' in novaPizza.cijene)) {
                return res.status(400).json({ error: 'Cijene moraju sadržavati: mala, srednja, jumbo' });
            }
            
            const result = await pizze_collection.insertOne(novaPizza);
            res.status(201).json({ insertedId: result.insertedId });
        } catch (error) {
            console.log(error.errorResponse);
            res.status(400).json({ error: error.errorResponse });
        }
    });

    // azuriraj
    router.patch('/:naziv', async (req, res) => {
        try {
            const pizze_collection = db.collection('pizze');
            const naziv_param = req.params.naziv;
            const novaCijena = req.body.cijena;
            
            const result = await pizze_collection.updateOne(
                { naziv: naziv_param }, 
                { $set: { cijena: novaCijena } }
            );
            
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Pizza nije pronađena' });
            }
            
            res.status(200).json({ modifiedCount: result.modifiedCount });
        } catch (error) {
            console.log(error.errorResponse);
            res.status(400).json({ error: error.errorResponse });
        }
    });

    router.put('/', async (req, res) => {
        try {
            const pizze_collection = db.collection('pizze');
            const noviMeni = req.body;
            
            await pizze_collection.deleteMany({});
            const result = await pizze_collection.insertMany(noviMeni);
            res.status(200).json({ insertedCount: result.insertedCount });
        } catch (error) {
            console.log(error.errorResponse);
            res.status(400).json({ error: error.errorResponse });
        }
    });

    router.delete('/:naziv', async (req, res) => {
        try {
            const pizze_collection = db.collection('pizze');
            const naziv_param = req.params.naziv;
            
            const result = await pizze_collection.deleteOne({ naziv: naziv_param });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Pizza nije pronađena' });
            }
            
            res.status(200).json({ deletedCount: result.deletedCount });
        } catch (error) {
            console.log(error.errorResponse);
            res.status(400).json({ error: error.errorResponse });
        }
    });

    return router;
}