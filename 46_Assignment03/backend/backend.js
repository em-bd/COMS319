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
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

/**
 * GET request:
 * Read all products contained in the
 * Mongodb catalogue
 */
app.get("/products", async (req, res) => {

});

/**
 * PUT request:
 * Updates the price of an object
 */
app.put("/products/:id", async (req, res) => {
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
        resizeTo.status(500).send({message : 'Internal Server Error'});
    }
});

/**
 * 
 */


// DELETE request:

