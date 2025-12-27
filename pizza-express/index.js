import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './db.js';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';

const PORT = 3000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pizza poslužitelj radi 🚀');
});

async function start() {
    const db = await connectToDatabase();

    // prosljeđujemo db routerima
    app.use('/pizze', pizzeRouter(db));
    app.use('/narudzbe', narudzbeRouter(db));

    app.listen(PORT, () => {
        console.log(`Pizza poslužitelj sluša na portu ${PORT}`);
    });
}

start();