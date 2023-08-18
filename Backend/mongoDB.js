// ici le fichier mongoDB.js pour tester la connexion à la base de données MongoDB 

const { MongoClient, ServerApiVersion } = require('mongodb');// Importation du package mongodb pour faciliter les interactions avec la base de donnée 

const uri = "mongodb+srv://nadiaDB:IccRUik3zyTCyVDY@nadiadb.rmy6few.mongodb.net/";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    
    await client.connect();

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    await client.close();
  }
}

run().catch(console.dir);
