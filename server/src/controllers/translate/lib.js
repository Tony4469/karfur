const { Translate } = require("@google-cloud/translate");
const projectId = "traduction-1551702821050";

const translate = new Translate({
  projectId: projectId,
  credentials: {
    type: "service_account",
    project_id: "traduction-1551702821050",
    private_key_id: process.env.GCLOUD_PRIVATE_KEY_ID,
    private_key: process.env.GCLOUD_PKEY.replace(/\\n/g, "\n"),
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    client_id: process.env.GCLOUD_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GCLOUD_CLIENT_X509,
  },

  // keyFilename: __dirname + "../../../config/Traduction-bd4ec8a5b32d-unharmed.json"
});

//A mettre en place d'abord:
//export GOOGLE_APPLICATION_CREDENTIALS="/Users/tonyparker/Documents/github/karfur/config/Traduction-bd4ec8a5b32d-unharmed.json"
function get_translation(req, res) {
  if (!req.body || !req.body.q) {
    res.status(400).json({ text: "Requête invalide" });
  } else {
    var q = req.body.q;
    var target = req.body.target;

    translate
      .translate(q, target)
      .then((results) => {
        const translation = results[0];
        res.send(translation);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("erreur de traduction : " + err);
        res.status(500).json({ text: "Erreur interne", err: err });
      });
  }
}

//On exporte notre fonction
exports.get_translation = get_translation;
