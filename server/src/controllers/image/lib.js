const Image = require("../../schema/schemaImage.js");
const cloudinary = require("cloudinary");
const logger = require("../../logger");

function set_image(req, res) {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  } else if (!req.files) {
    return res.status(400).json({ text: "Requête invalide" });
  }

  const values = Object.values(req.files);
  logger.info("[set_image] received a call", { values });
  const originalFilename = values[0] ? values[0].originalFilename : null;
  const promises = values.map((image) =>
    cloudinary.uploader.upload(image.path, "", { folder: "/pictures" })
  );

  Promise.all(promises).then((results) => {
    let imgData = results[0];
    if (imgData) {
      let image = {
        format: imgData.format,
        height: imgData.height,
        width: imgData.width,
        original_filename: originalFilename,
        public_id: imgData.public_id,
        secure_url: imgData.secure_url,
        signature: imgData.signature,
        url: imgData.url,
        version: imgData.version,
      };

      var _u = new Image(image);
      _u.save((err, data) => {
        if (err) {
          logger.error("[set_image] error while uploading image", {
            error: err,
          });
          res.status(500).json({
            text: "Erreur interne",
            error: err,
          });
        } else {
          res.status(200).json({
            text: "Succès",
            data: {
              imgId: data._id,
              public_id: data.public_id,
              secure_url: data.secure_url,
            },
          });
        }
      });
    } else {
      res.status(401).json({
        text: "Pas de résultats à l'enregistrement",
      });
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function get_image(req, res) {
  // var query = req.body.query;
  // var sort = req.body.sort;
  // var findRole = new Promise(function (resolve, reject) {
  //     Role.find(query).sort(sort).exec(function (err, result) {
  //       if (err) {
  //         reject(500);
  //       } else {
  //         if (result) {
  //           resolve(result)
  //         } else {
  //           reject(204)
  //         }
  //       }
  //     })
  // })
  // findRole.then(function (result) {
  //   res.status(200).json({
  //       "text": "Succès",
  //       "data": result
  //   })
  // }, function (error) {
  //   switch (error) {
  //     case 500:
  //       res.status(500).json({
  //           "text": "Erreur interne"
  //       })
  //       break;
  //     case 204:
  //       res.status(404).json({
  //           "text": "Erreur sur le résultat"
  //       })
  //       break;
  //     default:
  //       res.status(500).json({
  //         "text": "Erreur interne"
  //       })
  //   }
  // })
}

//On exporte notre fonction
exports.set_image = set_image;
exports.get_image = get_image;
