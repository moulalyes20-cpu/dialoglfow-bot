/**
 * Dialogflow ES Webhook — Assistant d'orientation universitaire
 * Framework : Express.js
 * Déploiement : Render
 */

'use strict';

const express = require('express');
const app = express();

// Parse incoming JSON from Dialogflow
app.use(express.json());

// ─── PORT (Render injects PORT automatically) ────────────────
const PORT = process.env.PORT || 3000;

// ─── Health check (Render ping) ──────────────────────────────
app.get('/', (req, res) => {
  res.send('Assistant d\'orientation universitaire — webhook actif.');
});

// ─── Orientation logic ───────────────────────────────────────
/**
 * Maps a student's interest to a recommended study field.
 * @param {string} interest - value from Dialogflow parameter
 * @returns {string} - French response text
 */
function getOrientationResponse(interest) {
  const normalized = (interest || '').toLowerCase().trim();

  const orientations = {
    programming: {
      field: 'Informatique et Systèmes d\'Information',
      careers: 'développeur logiciel, data scientist, ingénieur DevOps',
    },
    math: {
      field: 'Mathématiques / Génie Civil ou Électronique',
      careers: 'ingénieur, analyste quantitatif, enseignant-chercheur',
    },
    biology: {
      field: 'Médecine, Pharmacie ou Sciences Biologiques',
      careers: 'médecin, biologiste, chercheur en biotechnologie',
    },
    economics: {
      field: 'Sciences Économiques, Gestion ou Commerce',
      careers: 'économiste, manager, consultant financier',
    },
  };

  const match = orientations[normalized];

  if (match) {
    return (
      `D'après votre intérêt pour "${interest}", je vous recommande la filière : ` +
      `**${match.field}**.\n` +
      `Les débouchés incluent : ${match.careers}.\n` +
      `Souhaitez-vous plus de détails sur les conditions d'admission ?`
    );
  }

  // No match — ask the user to clarify
  return (
    'Je n\'ai pas bien identifié votre centre d\'intérêt. ' +
    'Pourriez-vous préciser parmi les domaines suivants : ' +
    'programmation, mathématiques, biologie ou économie ?'
  );
}

// ─── Intent handlers ─────────────────────────────────────────

/**
 * Intent: Orientation_Choice
 * Reads the "interest" parameter and recommends a study field.
 */
function handleOrientationChoice(queryResult) {
  const interest = queryResult.parameters && queryResult.parameters.interest
    ? queryResult.parameters.interest
    : '';

  return getOrientationResponse(interest);
}

/**
 * Intent: Python_Definition
 * Returns a simple, student-friendly explanation of Python.
 */
function handlePythonDefinition() {
  return (
    'Python est un langage de programmation simple et très populaire. ' +
    'Il est utilisé dans de nombreux domaines : développement web, intelligence artificielle, ' +
    'analyse de données et automatisation. ' +
    'Sa syntaxe claire en fait un excellent premier langage à apprendre. ' +
    'Voulez-vous savoir dans quelle filière on apprend Python ?'
  );
}

/**
 * Intent: AI_Definition
 * Returns a simple, student-friendly explanation of Artificial Intelligence.
 */
function handleAIDefinition() {
  return (
    'L\'Intelligence Artificielle (IA) est un domaine de l\'informatique qui permet ' +
    'aux machines d\'effectuer des tâches qui nécessitent normalement l\'intelligence humaine : ' +
    'reconnaître des images, comprendre le langage, jouer aux échecs ou conduire une voiture. ' +
    'Elle repose sur des techniques comme le machine learning et les réseaux de neurones. ' +
    'Vous intéressez-vous à une filière en IA ?'
  );
}

/**
 * Intent: Default Fallback Intent
 * Friendly fallback when Dialogflow cannot match the user's message.
 */
function handleFallback() {
  return (
    'Désolé, je n\'ai pas compris votre question. ' +
    'Je suis là pour vous aider avec votre orientation universitaire. ' +
    'Vous pouvez me demander : les filières disponibles, ce qu\'est Python, ' +
    'ou en savoir plus sur l\'intelligence artificielle.'
  );
}

// ─── Main webhook endpoint ────────────────────────────────────
app.post('/webhook', (req, res) => {
  try {
    const queryResult = req.body.queryResult;

    if (!queryResult) {
      return res.status(400).json({ fulfillmentText: 'Requête invalide.' });
    }

    const intentName = queryResult.intent && queryResult.intent.displayName
      ? queryResult.intent.displayName
      : '';

    console.log(`[Webhook] Intent reçu : "${intentName}"`);

    let responseText = '';

    switch (intentName) {
      case 'Orientation_Choice':
        responseText = handleOrientationChoice(queryResult);
        break;

      case 'Python_Definition':
        responseText = handlePythonDefinition();
        break;

      case 'AI_Definition':
        responseText = handleAIDefinition();
        break;

      case 'Default Fallback Intent':
        responseText = handleFallback();
        break;

      default:
        // Unknown intent — return a generic helpful message
        responseText =
          `Je ne suis pas encore formé pour répondre à cela. ` +
          `N'hésitez pas à me poser des questions sur votre orientation universitaire.`;
        break;
    }

    // Dialogflow expects this exact format
    return res.status(200).json({ fulfillmentText: responseText });

  } catch (error) {
    console.error('[Webhook] Erreur interne :', error);
    return res.status(500).json({
      fulfillmentText: 'Une erreur interne s\'est produite. Veuillez réessayer.',
    });
  }
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Webhook d'orientation universitaire démarré sur le port ${PORT}`);
});
