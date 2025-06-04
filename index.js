const express = require('express');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
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
        // await client.connect();

        const coffeesCollection = client.db("coffeeDB").collection("coffees");
        const usersCollection = client.db("coffeeDB").collection("users");

        app.get('/coffees', async (req, res) => {
            const result = await coffeesCollection.find().toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await coffeesCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeesCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const updated = req.body;
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: updated
            }
            const result = await coffeesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/myCoffees/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email
            };
            const result = await coffeesCollection.find(query).toArray();
            res.send(result);
        })

        app.patch('/like/:coffeeId', async (req, res) => {
            const id = req.params.coffeeId;
            const email = req.body.email;
            const filter = {
                _id: new ObjectId(id)
            };
            const coffee = await coffeesCollection.findOne(filter);
            const alreadyLiked = coffee?.likedBy.includes(email);
            const updateDoc = alreadyLiked ? {
                $pull: {
                    likedBy: email
                }
            } : {
                $addToSet: {
                    likedBy: email
                }
            }
            const result = await coffeesCollection.updateOne(filter, updateDoc);
            res.send({
                message: alreadyLiked ? 'Dislike Successful' : 'Like Successful',
                liked: !alreadyLiked,
            });
        })

        //users detail

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            const result = await usersCollection.insertOne(userProfile);
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };
            const updateUserData = req.body;
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: updateUserData
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        // await client.db("admin").command({
        //     ping: 1
        // });
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