// ici le fichier multer config pour l'upload des images 
//pour gerer les fichiers entrants dans les requetes http
// multer va permettre de gerer les fichiers entrants dans les requetes http
//fs permet de gerer les fichiers stockés
//sharp permet de modifier les images

const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

sharp.cache(false); // Désactive le cache de Sharp

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = (req, res, next) => {
  const uploadMiddleware = async (req, res, next) => {
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10 Mo
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    }).single('image');

    upload(req, res, async (err) => {
      if (err) {
        console.log('Image supérieure à 10 Mo');
        let error = new Error('L\'image dépasse la taille maximale autorisée (10 Mo).');
        error.statusCode = 400;
        next(error);
      } else {
        try {
          if (req.file) {
            const imagePath = req.file.path;
            const compressedImagePath = `${imagePath.split('.')[0]}-compressed.${imagePath.split('.')[1]}`;

            // Utilisation de Sharp pour compresser l'image
            await sharp(imagePath)
              .resize(800)
              .toFile(compressedImagePath);

            fs.unlinkSync(imagePath);
            fs.renameSync(compressedImagePath, imagePath);
          }

          next();
        } catch (error) {
          console.log('ERROR MULTER -- ', error);
          next(error);
        }
      }
    });
  };

  uploadMiddleware(req, res, next);
};
