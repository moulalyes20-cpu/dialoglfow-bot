const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    let responseText = "";

    if (intent === "Default Welcome Intent") {
        responseText = "Bonjour ! Je suis ton assistant d’orientation universitaire 🎓";
    } else {
        responseText = "Je peux t’aider avec les filières, inscription, documents...";
    }

    res.json({ fulfillmentText: responseText });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log("Server running");
});
