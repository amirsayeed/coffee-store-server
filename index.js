const express = require('express');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.tnmpmcr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const coffeesCollection = client.db("coffeeDB").collection("coffees");

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeesCollection.insertOne(newCoffee);
            res.send(result);
        })

        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee store server running');
})

app.listen(port, () => {
    console.log(`Coffee store server is running on port: ${port}`);
})