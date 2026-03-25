import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const [input, setInput] = useState("");
  const [position, setPosition] = useState(null);
  const [info, setInfo] = useState(null);

  const buscar = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/agente?query=${input}`
      );

      const data = res.data;

      if (data.tipo === "cep") {
        setPosition([
          parseFloat(data.resultado.coordenadas.lat),
          parseFloat(data.resultado.coordenadas.lon),
        ]);
        setInfo(data.resultado.endereco);
      } else {
        setPosition([
          parseFloat(data.resultado.lat),
          parseFloat(data.resultado.lon),
        ]);
        setInfo(data.resultado.endereco);
      }
    } catch (err) {
      alert("Erro ao buscar");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📍 Agente de Localização</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite CEP ou endereço"
        style={{ padding: 10, width: "300px" }}
      />

      <button onClick={buscar} style={{ marginLeft: 10 }}>
        Buscar
      </button>

      {position && (
        <div style={{ marginTop: 20 }}>
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "400px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>{info}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;