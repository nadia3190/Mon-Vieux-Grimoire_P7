// ici le fichier multer config pour l'upload des images 
//pour gerer les fichiers entrants dans les requetes http
// multer va permettre de gerer les fichiers entrants dans les requetes http
//fs permet de gerer les fichiers stockés
//sharp permet de modifier les images
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const storage = multer.diskStorage({// on crée un objet de configuration pour multer qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req, file, callback) => {// on indique à multer d'enregistrer les fichiers dans le dossier images 
    callback(null, 'public/images');// on passe le dossier images comme argument, multer va créer le dossier s'il n'existe pas déjà
  },
  filename: (req, file, callback) => {// on indique à multer d'utiliser le nom d'origine, on remplace les espaces par des underscores 
    const name = file.originalname.split(' ').join('_');
    callback(null, name);
  }
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: fileFilter
});

module.exports = (req, res, next) => {
  fs.chmod('public/images', 0o755, (err) => {
    if (err) {
      console.log('Erreur lors de la modification des permissions pour le dossier `images`');
    }

    const uploadMiddleware = (req, res) => {
      return new Promise((resolve, reject) => {
        upload.single('image')(req, res, (err) => {
          if (err) {
            console.log('Image supérieure à 4 Mo');
            let error = new Error('L\'image dépasse la taille maximale autorisée (4 Mo).');
            error.statusCode = 400;
            reject(error);
          } else {
            resolve();
          }
        });
      });
    };

    (async () => {
      try {
        await uploadMiddleware(req, res);

        if (req.file) {
          const imagePath = req.file.path;

          // Utilisation de Sharp pour compresser l'image
          await sharp(imagePath)
            .resize(800)
            .toFile(`${imagePath}-compressed`);

          fs.unlinkSync(imagePath);
          fs.renameSync(`${imagePath}-compressed`, imagePath);
        }

        next();
      } catch (error) {
      console.log('ERROR MULTER -- ')
        next(error);
      }
    })();
  });
};