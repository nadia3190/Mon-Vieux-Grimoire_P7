// ici le fichier multer config pour l'upload des images
//pour gerer les fichiers entrants dans les requetes http
// multer va permettre de gerer les fichiers entrants dans les requetes http
//fs permet de gerer les fichiers stockés
//sharp permet de modifier les images

const multer = require("multer"); // on importe multer pour la gestion des fichiers entrants dans les requêtes HTTP
const fs = require("fs"); //on importe fs pour la gestion des fichiers stockés
const sharp = require("sharp"); // on importe sharp pour la gestion des fichiers stockés

const storage = multer.diskStorage({
  // distStorage est un objet de configuration pour multer qui contient deux fonctions : destination et filename
  // on utilise la fonction diskStorage pour enregistrer sur le disque et on lui passe un objet de configuration
  destination: (req, file, callback) => {
    // on indique la destination des fichiers entrants dans la requete
    callback(null, "public/images"); // on indique le dossier de destination des images
    //callback = fonction qui permet de renvoyer une réponse au client (comme un return)
  },
  filename: (req, file, callback) => {
    // on indique le nom du fichier
    const name = file.originalname.split(" ").join("_"); // on utilise le nom d'origine du fichier en remplaçant les espaces par des underscores pour éviter les erreurs
    callback(null, name); // on appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur et on passe le nom du fichier
  },
});

const fileFilter = (req, file, callback) => {
  // on filtre les fichiers entrants pour n'autoriser que les fichiers jpeg et png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // on vérifie le type de fichier
    callback(null, true); // on appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur et on passe true pour accepter le fichier
  } else {
    // si le type de fichier n'est pas accepté, on envoie une erreur
    callback(null, false); // on appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur et on passe false pour refuser le fichier
  }
};

const upload = multer({
  // on exporte l'élément multer configuré
  storage: storage,
  limits: {
    // on limite la taille des fichiers à 4 Mo
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

module.exports = (req, res, next) => {
  // fonction qui permet de gérer les fichiers entrants dans les requêtes HTTP
  fs.chmod("public/images", 0o755, (err) => {
    // on modifie les permissions du dossier `images` pour autoriser la lecture, l'écriture et l'exécution par tout le monde
    if (err) {
      // si une erreur survient, on affiche un message d'erreur
      console.log(
        "Erreur lors de la modification des permissions pour le dossier `images`"
      );
    }

    const uploadMiddleware = (req, res) => {
      // on crée une fonction pour gérer les fichiers entrants dans les requêtes HTTP et on lui passe la requête et la réponse
      return new Promise((resolve, reject) => {
        // Promise = objet qui représente l'état d'une opération asynchrone (en cours, terminée ou en échec)
        // on crée une promesse pour gérer les fichiers entrants dans les requêtes HTTP et on lui passe la requête et la réponse
        upload.single("image")(req, res, (err) => {
          //.single("image") = on précise qu'on attend un seul fichier avec le nom image
          if (err) {
            console.log("Image supérieure à 4 Mo");
            let error = new Error(
              "L'image dépasse la taille maximale autorisée (4 Mo)."
            );
            error.statusCode = 400;
            reject(error);
          } else {
            resolve(); // resolve = fonction qui permet de renvoyer une réponse au client (comme un return)
          }
        });
      });
    };

    (async () => {
      try {
        await uploadMiddleware(req, res);

        if (req.file) {
          // si la requete contient un fichier
          const imagePath = req.file.path; // on récupère le chemin de l'image

          // Utilisation de Sharp pour compresser l'image
          await sharp(imagePath).resize(800).toFile(`${imagePath}-compressed`);

          fs.unlinkSync(imagePath); // on supprime l'image d'origine
          fs.renameSync(`${imagePath}-compressed`, imagePath); // on renomme l'image compressée avec le nom de l'image d'origine
        }

        next(); // on passe au middleware suivant
      } catch (error) {
        console.log("ERROR MULTER -- ");
        next(error);
      }
    })();
  });
};
