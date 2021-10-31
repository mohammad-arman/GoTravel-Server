const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yfbk8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('GoTravelAgency');
        const touristSpotCollection = database.collection('touristSpots');
        const bookingSpotCollection = database.collection('bookingSpots');
        

        //POST API
        app.post('/touristSpots', async(req,res)=> {
            const touristSpot = req.body;
            const result = await touristSpotCollection.insertOne(touristSpot);
            res.json(result)
        });

        //GET API
        app.get('/touristSpots', async(req, res)=> {
            const cursor = touristSpotCollection.find({});
            const allTouristSpot = await cursor.toArray();
            res.send(allTouristSpot);
        });

        //GET SINGLE DATA API
        app.get('/touristSpots/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const singleSpot = await touristSpotCollection.findOne(query);
            res.send(singleSpot)
           });

        // POST BOOKING API
        app.post('/bookingSpots', async(req,res)=>{
            const bookingSpot = req.body;
            const result = await bookingSpotCollection.insertOne(bookingSpot)
            res.json(result);
        });

         //GET ALL BOOKING API
        app.get('/allbookingsmanage', async(req, res)=> {
            const cursor = bookingSpotCollection.find({});
            const allBookingSpot = await cursor.toArray();
            res.send(allBookingSpot);
        });

        //DELETE SINGLE BOOKING API
        app.delete('/deletebooking/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id)};
            const result = await bookingSpotCollection.deleteOne(query);
            res.json(result)
        });

        //My Booking get api
        app.get('/mybooking/:email', async(req,res)=>{
            const result = await bookingSpotCollection.find({email: req.params.email,}).toArray();
            res.send(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


















//user: GoTravelAgency
//pass: z9hYyvkX42rMPbW9