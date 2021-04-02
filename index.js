const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yd15c.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(express.json())
app.use(cors())


const port = 5055

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("natural-foods").collection("foods");
    const productCollectionForOrder = client.db("natural-foods").collection("orders");
    console.log('database connected');
    console.log(err);


    app.get('/products', (req, res) =>{
        productCollection.find()
        .toArray((err, items) =>{
          res.send(items)
        })
      })

    
      app.post('/addProduct', (req, res) =>{
        const newItem = req.body;
        console.log('adding new item: ', newItem);
        productCollection.insertOne(newItem)
        .then(result => {
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount > 0)
        })
      })

     
    app.get('/review/:id',(req,res)=>{
    productCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })

    app.post("/addOrders", (req, res) => {
        const newOrder = req.body;
        console.log(newOrder);
        // productCollectionForOrder.insertOne(newOrder).then((result) => {
        //     res.send(result.insertedCount > 0);
        //     console.log('data added');
        // });
        productCollectionForOrder.insertOne(newOrder).then((result)=> {
            res.send(result.insertedCount > 0)
            console.log('hello');
        })
    });
     
    app.get("/orders", (req, res) => {
        productCollectionForOrder.find().toArray((err, items) => {
            res.send(items);
        });
    });
     
    app.delete('/delete/:_id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })
    });
})
  
app.get('/', (req, res) => {
  res.send('Hello World!')
})

});


app.listen(process.env.PORT || port)
