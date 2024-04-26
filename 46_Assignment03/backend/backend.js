/**
 * Authors: Em Bradley-DeHaan,
 *          Samuel Craft
 * ISU Netids: emmieb@iastate.edu
 *          craftsam@iastate.edu
 * Date: April 27th, 2024
 */

const { MongoClient } = require("mongodb");

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
const db = client.db(dbName);

/**
 * GET request:
 * Read all products contained in the
 * Mongodb catalogue
 */
app.get("/products", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};

    const results = await db
        .collection("fakestore_catalog")
        .find(query)
        .limit(100)
        .toArray();

    console.log(results);
    res.status(200);
    res.send(results);
});

/**
 * GET id request:
 * Reads product with that specific id
 */
app.get("/products/:id", async (req, res) => {
    const productID = Number(req.params.id);
    console.log("Product to find :", productID);

    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { "id" : productID };
    const results = await db
        .collection("fakestore_catalog")
        .findOne(query);

    console.log("Results :", results);
    if (!results)
        res.send("Not found").status(404);
    else
        res.send(results).status(200);
});

/**
 * PUT request:
 * Updates the price of an object
 */
app.put("/updateProduct/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const query = { id : id };

        await client.connect();
        console.log("Product to update :", id);

        console.log(req.body);

        const updateData = {
            $set: {
                // stuff
            }
        }

    } catch (error) {
        console.error("Error updating product price :", error);
        res.status(500).send({message : 'Internal Server Error'});
    }
});

/**
 * POST request:
 * Will add a new product
 */
app.post("/addProduct", async (req, res) => {
    try {
        await client.connect();
        const values = Object.values(req.body);

        const newDocument = {
            "id" : values[0],
            "title" : values[1],
            "price" : values[2],
            "description" : values[3],
            "category" : values[4],
            "image" : values[5],
            "rating" : values[6]
        };

        console.log(newDocument);

        const results = await db
            .collection("fakestore_catalog")
            .insertOne(newDocument);
        res.status(200);
        res.send(results);
    } catch (error) {
        console.error();
        res.status(500).send({message : 'Internal Server Error'});
    }
});

/**
 * DELETE request:
 * Deletes Product with the specified id
 */
app.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await client.connect();
        console.log("Product to delete :", id);

        const query = { id : id };

        // delete
        const results = await db.collection("fakestore_catalog").deleteOne(query);
        res.status(200);
        res.send(results);
    } catch (error) {
        console.error("Error deleting product :", error);
        res.status(500).send({ message : 'Internal Server Error' });
    }
});
