// ici le fichier mongoDB.js pour tester la connexion à la base de données MongoDB

const { MongoClient, ServerApiVersion } = require("mongodb"); // Importation du package mongodb pour faciliter les interactions avec la base de donnée
require("dotenv").config(); // Importation du package dotenv pour masquer les informations de connexion à la base de données

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    // pour utiliser la version 1 de l'API MongoDB
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
