nst crypto = require('crypto');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    };
  }

  try {
    let data;
    if (event.headers['content-type'] === 'application/x-www-form-urlencoded') {
      const querystring = require('querystring');
      data = querystring.parse(event.body);
    } else {
      data = JSON.parse(event.body);
    }

    const { type_event, item_price, ref_command } = data;

    if (type_event === 'sale_complete') {
      const parts = ref_command.split('-');
      const playerTelegramId = parts[1]; 

      console.log(`💰 Paiement validé pour le joueur ${playerTelegramId}. Montant : ${item_price} XOF`);

      // TODO: Insérez ici votre code pour attribuer la machine de minage au joueur dans votre base de données.

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Paiement traité avec succès" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Événement ignoré" }),
    };

  } catch (error) {
    console.error("Erreur IPN PayTech :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur lors du traitement", details: error.message }),
    };
  }
};
