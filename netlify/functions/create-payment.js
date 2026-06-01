const axios = require('axios'); 

exports.handler = async (event, context) => {
  // Renvoyer une erreur si ce n'est pas une requête POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    };
  } 

  try {
    const { amount, playerTelegramId } = JSON.parse(event.body); 

    if (!amount || !playerTelegramId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Montant et ID joueur requis" }),
      };
    } 

    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET; 

    const response = await axios.post(
      'https://paytech.sn/api/payment/request-payment',
      {
        item_name: "Achat Machine Titan Miner",
        item_price: amount,
        currency: "XOF",
        ref_command: `TITAN-${playerTelegramId}-${Date.now()}`,
        command_name: `Recharge Titan Miner pour ${playerTelegramId}`,
        env: "live",
        ipn_url: "https://loquacious-tulumba-be8836.netlify.app/api/paytech-callback",
        success_url: "https://loquacious-tulumba-be8836.netlify.app/success",
        cancel_url: "https://loquacious-tulumba-be8836.netlify.app/cancel"
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'API_KEY': apiKey,
          'API_SECRET': apiSecret
        }
      }
    ); 

    if (response.data && response.data.success === 1) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          payment_url: response.data.redirect_url,
          token: response.data.token 
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Échec de la génération du paiement via PayTech", details: response.data }),
      };
    } 

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur interne du serveur", message: error.message }),
    };
  }
}; // <--- LE FICHIER DOIT FINIR ICI !
