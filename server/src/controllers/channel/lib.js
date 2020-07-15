const Channel = require("../../schema/schemaChannel.js");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function add_channel(req, res, io) {
  if (!req.body || !req.body.itemId || !req.body.itemName) {
    //Le cas où la requête ne serait pas soumise ou nul
    res.status(400).json({
      text: "Requête invalide",
    });
  } else {
    let channel = req.body;
    //check if there is existing channel first, else create it
    var find = new Promise(function (resolve, reject) {
      Channel.findOne(
        {
          itemId: channel.itemId,
          itemName: channel.itemName,
          filter: channel.filter || { $exists: false },
        },
        function (err, result) {
          if (err) {
            reject(500);
          } else {
            resolve(result);
            // if (result) {
            //   resolve(result)
            // } else {
            //   reject(204);
            // }
          }
        }
      );
    });

    find.then(
      (result) => {
        let x = req.user;
        let newMessage = {
          text: channel.message,
          created_at: new Date(),
          from: x
            ? {
                userId: x._id,
                username: x.username,
                email: x.email,
                description: x.description,
                picture: x.picture,
                roles: x.roles,
              }
            : undefined,
        };
        let _u;
        if (result) {
          result.messages = [...result.messages, newMessage];
          result.markModified("messages");
          if (!result.users.find((x) => x === req.userId)) {
            result.users = [...result.users, req.userId];
            result.markModified("users");
          }
          _u = result;
        } else {
          let newChannel = {
            ...channel,
            messages: [newMessage],
            users: [req.userId],
            status: "Actif",
          };
          _u = new Channel(newChannel);
        }
        _u.save(function (err, data) {
          if (err) {
            res.status(500).json({
              text: "Erreur interne",
            });
          } else {
            data.messages = data.messages.map((x) => {
              return { ...x, isMe: x.from.userId === req.userId };
            });
            res.status(200).json({
              text: "Succès",
              data: data,
            });
          }
        });
      },
      // eslint-disable-next-line no-use-before-define
      (e) => _errorHandler(e, res)
    );
  }
}

function get_channel(req, res) {
  var query = req.body.query;
  var sort = req.body.sort;
  var populate = req.body.populate;
  if (populate && populate.constructor === Object) {
    populate.select = "-password";
  } else if (populate) {
    populate = { path: populate, select: "-password" };
  } else {
    populate = "";
  }

  var find = new Promise(function (resolve, reject) {
    Channel.find(query)
      .sort(sort)
      .populate(populate)
      .exec(function (err, result) {
        if (err) {
          reject(500);
        } else {
          if (result) {
            resolve(result);
          } else {
            reject(404);
          }
        }
      });
  });

  find.then(
    function (result) {
      [].forEach.call(result, (channel) => {
        channel.messages = channel.messages.map((x) => {
          return { ...x, isMe: x.from.userId === req.userId };
        });
      });
      res.status(200).json({
        text: "Succès",
        data: result,
      });
    },
    // eslint-disable-next-line no-use-before-define
    (e) => _errorHandler(e, res)
  );
}

const _errorHandler = (error, res) => {
  switch (error) {
    case 500:
      res.status(500).json({
        text: "Erreur interne",
      });
      break;
    case 404:
      res.status(404).json({
        text: "Pas de résultats",
      });
      break;
    default:
      res.status(500).json({
        text: "Erreur interne",
      });
  }
};

//On exporte notre fonction
exports.add_channel = add_channel;
exports.get_channel = get_channel;