const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

/*
No Render, crie a variável de ambiente:
EA_COOKIE = sid=SEU_COOKIE
*/
const EA_COOKIE = process.env.EA_COOKIE;

const headers = {
    "User-Agent": "Mozilla/5.0",
    "Cookie": EA_COOKIE
};

// ===============================
// STATUS DO SERVIDOR
// ===============================
app.get("/", (req, res) => {
    res.send("EA Proxy ativo");
});

// ===============================
// ÚLTIMAS 10 PARTIDAS
// ===============================
app.get("/matches", async (req, res) => {

    const clubId = req.query.clubId;

    if (!clubId) {
        return res.json({ erro: "clubId obrigatório" });
    }

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

        if (error.response && error.response.status === 403) {
            return res.json({
                erro: "Sessão EA expirada",
                acao: "Atualize o EA_COOKIE no Render"
            });
        }

        res.json({
            erro: "Falha ao buscar partidas",
            detalhe: error.message
        });
    }
});

// ===============================
// DETALHES DA PARTIDA
// ===============================
app.get("/match", async (req, res) => {

    const matchId = req.query.matchId;

    if (!matchId) {
        return res.json({ erro: "matchId obrigatório" });
    }

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

        if (error.response && error.response.status === 403) {
            return res.json({
                erro: "Sessão EA expirada",
                acao: "Atualize o EA_COOKIE no Render"
            });
        }

        res.json({
            erro: "Falha ao buscar detalhes",
            detalhe: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log("EA Proxy rodando na porta " + PORT);
});
