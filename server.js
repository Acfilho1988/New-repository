const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/*
COLOQUE AQUI SEU COOKIE DA EA
Exemplo:
sid=xxxxxxxxxxxx
*/
const EA_COOKIE = "sid=ABCD123456789XYZ";

const headers = {
    "User-Agent": "Mozilla/5.0",
    "Cookie": EA_COOKIE
};

// Últimas 10 partidas
app.get("/matches", async (req, res) => {
    const clubId = req.query.clubId;

    try {
        const response = await axios.get(
            "https://proclubs.ea.com/api/fc/matchhistory",
            {
                params: { clubId: clubId },
                headers: headers
            }
        );

        res.json(response.data.slice(0, 10));

    } catch (error) {
        res.json({ erro: error.message });
    }
});

// Detalhes da partida
app.get("/match", async (req, res) => {
    const matchId = req.query.matchId;

    try {
        const response = await axios.get(
            "https://proclubs.ea.com/api/fc/matchdetails",
            {
                params: { matchId: matchId },
                headers: headers
            }
        );

        res.json(response.data);

    } catch (error) {
        res.json({ erro: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Servidor EA Proxy rodando");
});
