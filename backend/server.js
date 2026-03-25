console.log("🚀 ESTE É O SERVER CERTO");
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/agente", async (req, res) => {
  console.log("🔥 ROTA /agente FOI CHAMADA");

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ erro: "Query obrigatória" });
  }

  try {
    const cepMatch = query.match(/\d{8}/);

    // 🔎 CASO CEP
    if (cepMatch) {
      const cep = cepMatch[0];

      const viaCep = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      if (viaCep.data.erro) {
        return res.status(404).json({ erro: "CEP não encontrado" });
      }

      const data = viaCep.data;

      const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`;

      const geo = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: endereco,
          },
          headers: {
            "User-Agent": "agent",
          },
        }
      );

      return res.json({
        tipo: "cep",
        resultado: {
          endereco,
          coordenadas: {
            lat: geo.data[0]?.lat,
            lon: geo.data[0]?.lon,
          },
        },
      });
    }

    // 🌍 CASO ENDEREÇO
    const geo = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          q: query,
        },
        headers: {
          "User-Agent": "agent",
        },
      }
    );

    if (!geo.data.length) {
      return res.json({ erro: "Não encontrado" });
    }

    return res.json({
      tipo: "endereco",
      resultado: {
        endereco: query,
        lat: geo.data[0].lat,
        lon: geo.data[0].lon,
      },
    });

  } catch (err) {
  console.error("ERRO REAL:", err.message);
  res.status(500).json({ erro: "Erro no agente" });
}
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});