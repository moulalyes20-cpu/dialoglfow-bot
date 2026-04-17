/**
 * Dialogflow ES Webhook — Assistant d'orientation universitaire
 * Framework  : Express.js
 * Déploiement: Render
 *
 * Tous les noms d'intents correspondent EXACTEMENT aux noms
 * définis dans la console Dialogflow (casse, accents, espaces).
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

// ════════════════════════════════════════════════════════════
//  INTENT HANDLERS  (une fonction par intent)
// ════════════════════════════════════════════════════════════

// ─── Default Welcome Intent ──────────────────────────────────
function handleWelcome() {
  return (
    'Bienvenue ! Je suis votre assistant d\'orientation universitaire. ' +
    'Je suis là pour vous aider à choisir la filière qui correspond le mieux à vos intérêts et à vos ambitions. ' +
    'Parlez-moi de vos passions ou dites-moi simplement "je veux m\'orienter" pour commencer.'
  );
}

// ─── Salutation ───────────────────────────────────────────────
function handleSalutation() {
  return (
    'Bonjour ! Ravi de vous accueillir. ' +
    'Comment puis-je vous aider dans votre orientation universitaire aujourd\'hui ?'
  );
}

// ─── État (ça va ?) ───────────────────────────────────────────
function handleEtat() {
  return (
    'Je vais très bien, merci de demander ! ' +
    'Je suis prêt à vous accompagner dans votre orientation. ' +
    'Qu\'est-ce qui vous intéresse comme domaine d\'études ?'
  );
}

// ─── choix ────────────────────────────────────────────────────
function handleChoix(queryResult) {
  const interest = (queryResult.parameters && queryResult.parameters.interest)
    ? queryResult.parameters.interest.toLowerCase().trim()
    : '';

  const map = {
    programmation : 'Informatique et Génie Logiciel',
    informatique  : 'Informatique et Systèmes d\'Information',
    maths         : 'Mathématiques / Génie',
    mathématiques : 'Mathématiques / Génie',
    biologie      : 'Sciences Biologiques / Médecine',
    médecine      : 'Médecine / Pharmacie',
    économie      : 'Sciences Économiques et Gestion',
    gestion       : 'Gestion et Commerce',
    droit         : 'Droit et Sciences Juridiques',
    architecture  : 'Architecture et Urbanisme',
    astronomie    : 'Astronomie / Astrophysique',
    lettres       : 'Lettres et Langues',
    langues       : 'Lettres et Langues',
  };

  const field = map[interest];

  if (field) {
    return (
      `Excellent choix ! D'après votre intérêt, je vous recommande la filière : ${field}. ` +
      'Voulez-vous en savoir plus sur cette filière ou souhaitez-vous explorer d\'autres options ?'
    );
  }

  return (
    'Pouvez-vous me préciser vos centres d\'intérêt ? ' +
    'Par exemple : informatique, médecine, droit, architecture, économie, lettres ou astronomie.'
  );
}

// ─── INTENT : Choix final ─────────────────────────────────────
function handleChoixFinal() {
  return (
    'Félicitations pour votre décision ! ' +
    'Pour finaliser votre inscription, rendez-vous sur la plateforme PROGRES et confirmez votre orientation. ' +
    'N\'hésitez pas si vous avez des questions sur les documents requis ou les dates importantes.'
  );
}

// ─── Choix_medecine ───────────────────────────────────────────
function handleChoixMedecine() {
  return (
    'La médecine est un choix noble et exigeant. ' +
    'Pour intégrer la faculté de médecine, vous aurez besoin d\'un excellent dossier académique, ' +
    'notamment en sciences naturelles et en chimie. ' +
    'Les études durent généralement 7 ans (+ résidanat). ' +
    'Les débouchés incluent : médecin généraliste, spécialiste, chercheur, pharmacien. ' +
    'Souhaitez-vous connaître les conditions d\'admission spécifiques ?'
  );
}

// ─── Hésitation ──────────────────────────────────────────────
function handleHesitation() {
  return (
    'C\'est tout à fait normal d\'hésiter, c\'est une décision importante ! ' +
    'Essayons d\'y voir plus clair ensemble. ' +
    'Dites-moi : qu\'est-ce que vous aimez faire dans votre temps libre ? ' +
    'Ou dans quelle matière êtes-vous le plus à l\'aise ?'
  );
}

// ─── stress ───────────────────────────────────────────────────
function handleStress() {
  return (
    'Je comprends que cette période peut être stressante. ' +
    'Prenez une grande respiration — vous n\'êtes pas seul(e). ' +
    'Chaque étudiant passe par cette étape. ' +
    'Ensemble, nous allons identifier la filière qui vous correspond le mieux. ' +
    'Par quoi souhaitez-vous commencer ?'
  );
}

// ─── INTENT : Discussion libre ────────────────────────────────
function handleDiscussionLibre() {
  return (
    'Je suis là pour vous écouter ! ' +
    'Parlez-moi de ce qui vous passionne, de vos projets ou de vos questions sur l\'université. ' +
    'Je ferai de mon mieux pour vous guider.'
  );
}

// ─── Interet_bio ─────────────────────────────────────────────
function handleInteretBio() {
  return (
    'Super, la biologie est un domaine fascinant ! ' +
    'Vous pourriez vous orienter vers : Biologie, Biochimie, Médecine, Pharmacie ou Biotechnologie. ' +
    'Ces filières ouvrent des portes vers la recherche scientifique, le secteur médical ou l\'industrie pharmaceutique. ' +
    'Lequel de ces domaines vous attire le plus ?'
  );
}

// ─── Interet_maths ───────────────────────────────────────────
function handleInteretMaths() {
  return (
    'Les mathématiques sont la base de nombreuses disciplines ! ' +
    'Avec un fort intérêt pour les maths, vous pouvez viser : ' +
    'Mathématiques pures, Informatique, Génie (civil, électronique, mécanique) ou Finance quantitative. ' +
    'Vous préférez les maths théoriques ou appliquées ?'
  );
}

// ─── Preference_theorique ────────────────────────────────────
function handlePreferenceTheorique() {
  return (
    'Si vous aimez la théorie et la réflexion profonde, vous pourriez exceller dans : ' +
    'Mathématiques pures, Physique théorique, Philosophie, Droit ou Littérature. ' +
    'Ces filières développent la rigueur intellectuelle et la capacité d\'analyse. ' +
    'Laquelle de ces pistes vous inspire ?'
  );
}

// ─── INTENT : Architecture ───────────────────────────────────
function handleArchitecture() {
  return (
    'L\'architecture est un domaine qui allie créativité et technique ! ' +
    'Les études durent 5 à 6 ans (diplôme d\'architecte). ' +
    'Vous travaillerez sur la conception de bâtiments, l\'urbanisme et le patrimoine. ' +
    'Compétences clés : dessin technique, logiciels CAO, culture artistique. ' +
    'Souhaitez-vous en savoir plus sur les conditions d\'admission en architecture ?'
  );
}

// ─── INTENT : Astronomie (intent 3) ──────────────────────────
function handleAstronomie() {
  return (
    'L\'astronomie est une science passionnante qui explore l\'univers ! ' +
    'En Algérie, cette spécialité est accessible via une licence en Physique, ' +
    'puis une spécialisation en Astrophysique ou Astronomie en Master ou Doctorat. ' +
    'Les débouchés se trouvent principalement dans la recherche et l\'enseignement supérieur. ' +
    'Êtes-vous aussi intéressé(e) par la physique en général ?'
  );
}

// ─── INTENT : Droit (intent 6) ───────────────────────────────
function handleDroit() {
  return (
    'Le droit est une filière rigoureuse et très valorisée ! ' +
    'Les études durent 3 ans (Licence) puis 2 ans (Master) ou plus pour le Doctorat. ' +
    'Spécialités : Droit privé, Droit public, Droit international, Sciences criminelles. ' +
    'Débouchés : avocat, magistrat, juriste d\'entreprise, notaire, diplomate. ' +
    'Avez-vous une spécialité juridique en tête ?'
  );
}

// ─── INTENT : Lettres / Langues ──────────────────────────────
function handleLettresLangues() {
  return (
    'Les lettres et langues ouvrent de nombreuses perspectives ! ' +
    'Vous pouvez vous spécialiser en : Littérature arabe, Littérature française, ' +
    'Langues étrangères (anglais, espagnol...) ou Traduction et interprétation. ' +
    'Débouchés : enseignant, traducteur, journaliste, diplomate, auteur. ' +
    'Quelle langue ou littérature vous passionne le plus ?'
  );
}

// ─── INTENT : Recherche / Biologie ───────────────────────────
function handleRechercheBiologie() {
  return (
    'La recherche en biologie est un domaine d\'avenir ! ' +
    'Filières possibles : Biologie cellulaire, Génétique, Microbiologie, Écologie, Biotechnologie. ' +
    'Le parcours recommandé est Licence → Master → Doctorat pour intégrer des laboratoires de recherche. ' +
    'Vous intéressez-vous davantage à la biologie fondamentale ou appliquée ?'
  );
}

// ─── INTENT : Économie / Gestion ─────────────────────────────
function handleEconomieGestion() {
  return (
    'L\'économie et la gestion sont des filières très demandées ! ' +
    'Spécialités disponibles : Économie, Finance, Comptabilité, Marketing, Management. ' +
    'Débouchés : économiste, analyste financier, manager, entrepreneur, consultant. ' +
    'Ces filières se retrouvent dans les facultés des Sciences Économiques. ' +
    'Plutôt économie théorique ou gestion d\'entreprise ?'
  );
}

// ─── Info_informatique ────────────────────────────────────────
function handleInfoInformatique() {
  return (
    'La filière Informatique est l\'une des plus dynamiques ! ' +
    'Spécialités : Génie Logiciel, Réseaux & Télécoms, Intelligence Artificielle, ' +
    'Sécurité Informatique, Data Science. ' +
    'Durée : 3 ans (Licence) + 2 ans (Master). ' +
    'Débouchés : développeur, ingénieur système, data scientist, architecte cloud. ' +
    'Avez-vous des connaissances en programmation ?'
  );
}

// ─── AI ───────────────────────────────────────────────────────
function handleAI() {
  return (
    'L\'Intelligence Artificielle (IA) est la capacité des machines à simuler l\'intelligence humaine. ' +
    'Elle repose sur le Machine Learning, le Deep Learning et le traitement du langage naturel (NLP). ' +
    'Applications : reconnaissance faciale, chatbots, voitures autonomes, diagnostic médical. ' +
    'En Algérie, on aborde l\'IA en Master Informatique ou en spécialisation IA. ' +
    'Voulez-vous vous orienter vers une filière IA ?'
  );
}

// ─── Apprendre Python ─────────────────────────────────────────
function handleApprendrePython() {
  return (
    'Excellente initiative ! Pour apprendre Python, voici un parcours recommandé : ' +
    '1. Commencez par les bases : variables, boucles, fonctions (ressource : python.org). ' +
    '2. Pratiquez sur des projets simples : calculatrice, jeu de devinette. ' +
    '3. Explorez des bibliothèques : NumPy (maths), Pandas (données), Flask (web). ' +
    'Plateformes gratuites : CS50 (Harvard), OpenClassrooms, Codecademy. ' +
    'Souhaitez-vous des ressources en français ?'
  );
}

// ─── python ───────────────────────────────────────────────────
function handlePython() {
  return (
    'Python est un langage de programmation simple, lisible et très puissant. ' +
    'Créé en 1991, il est aujourd\'hui le langage numéro 1 dans l\'IA, la data science et l\'automatisation. ' +
    'Sa syntaxe claire en fait le meilleur choix pour les débutants. ' +
    'Il est enseigné dans presque toutes les filières informatiques. ' +
    'Voulez-vous savoir comment l\'apprendre ?'
  );
}

// ─── Utilité Python ───────────────────────────────────────────
function handleUtilitePython() {
  return (
    'Python est utile dans de très nombreux domaines : ' +
    '• Intelligence Artificielle et Machine Learning (TensorFlow, PyTorch). ' +
    '• Analyse de données et Data Science (Pandas, NumPy, Matplotlib). ' +
    '• Développement web (Django, Flask). ' +
    '• Automatisation de tâches répétitives. ' +
    '• Cybersécurité et scripts système. ' +
    'En résumé : apprendre Python, c\'est s\'ouvrir des portes dans presque tous les secteurs tech.'
  );
}

// ─── remerciment ─────────────────────────────────────────────
function handleRemerciment() {
  return (
    'Avec plaisir ! C\'est un honneur de vous accompagner dans ce choix important. ' +
    'N\'hésitez pas à revenir si vous avez d\'autres questions sur votre orientation. ' +
    'Bonne chance dans vos études !'
  );
}

// ─── INTENT : Au revoir ───────────────────────────────────────
function handleAuRevoir() {
  return (
    'Au revoir et bonne chance dans votre parcours universitaire ! ' +
    'N\'hésitez pas à revenir si vous avez des questions. À bientôt !'
  );
}

// ─── Default Fallback Intent ─────────────────────────────────
function handleFallback() {
  return (
    'Désolé, je n\'ai pas bien compris. ' +
    'Je peux vous aider sur : les filières (informatique, médecine, droit, architecture...), ' +
    'Python, l\'intelligence artificielle, ou votre orientation en général. ' +
    'Que souhaitez-vous savoir ?'
  );
}

// ════════════════════════════════════════════════════════════
//  WEBHOOK ENDPOINT
// ════════════════════════════════════════════════════════════
app.post('/webhook', (req, res) => {
  try {
    const queryResult = req.body.queryResult;

    if (!queryResult) {
      return res.status(400).json({ fulfillmentText: 'Requête invalide.' });
    }

    const intentName = (queryResult.intent && queryResult.intent.displayName)
      ? queryResult.intent.displayName
      : '';

    console.log(`[Webhook] Intent reçu : "${intentName}"`);

    let responseText = '';

    // ── Switch exact sur les noms d'intents Dialogflow ───────
    switch (intentName) {

      case 'Default Welcome Intent':
        responseText = handleWelcome();
        break;

      case 'Salutation':
        responseText = handleSalutation();
        break;

      case 'État (ça va ?)':
        responseText = handleEtat();
        break;

      case 'choix':
        responseText = handleChoix(queryResult);
        break;

      case 'INTENT : Choix final':
        responseText = handleChoixFinal();
        break;

      case 'Choix_medecine':
        responseText = handleChoixMedecine();
        break;

      case 'Hésitation':
        responseText = handleHesitation();
        break;

      case 'stress':
        responseText = handleStress();
        break;

      case 'INTENT : Discussion libre':
        responseText = handleDiscussionLibre();
        break;

      case 'Interet_bio':
        responseText = handleInteretBio();
        break;

      case 'Interet_maths':
        responseText = handleInteretMaths();
        break;

      case 'Preference_theorique':
        responseText = handlePreferenceTheorique();
        break;

      case 'INTENT : Architecture':
        responseText = handleArchitecture();
        break;

      case '3. INTENT : Astronomie':
        responseText = handleAstronomie();
        break;

      case '6. INTENT : Droit':
        responseText = handleDroit();
        break;

      case 'INTENT : Lettres / Langues':
        responseText = handleLettresLangues();
        break;

      case 'INTENT : Recherche / Biologie':
        responseText = handleRechercheBiologie();
        break;

      case 'INTENT : Économie / Gestion':
        responseText = handleEconomieGestion();
        break;

      case 'Info_informatique':
        responseText = handleInfoInformatique();
        break;

      case 'AI':
        responseText = handleAI();
        break;

      case 'Apprendre Python':
        responseText = handleApprendrePython();
        break;

      case 'python':
        responseText = handlePython();
        break;

      case 'Utilité Python':
        responseText = handleUtilitePython();
        break;

      case 'remerciment':
        responseText = handleRemerciment();
        break;

      case 'INTENT : Au revoir':
        responseText = handleAuRevoir();
        break;

      case 'Default Fallback Intent':
        responseText = handleFallback();
        break;

      default:
        // Intent reçu mais non géré — utile pour debug
        console.warn(`[Webhook] Intent non géré : "${intentName}"`);
        responseText = handleFallback();
        break;
    }

    // Dialogflow attend exactement ce format JSON
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
