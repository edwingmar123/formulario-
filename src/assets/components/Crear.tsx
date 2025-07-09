import { useState } from "react";
import { db } from "./Credenciales";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";

interface Lugar {
  nombre?: string;
  email?: string;
  telefono?: string;
  pais?: string;
  fecha: string;
  ciudad: string;
  hotel: string;
}

interface CrearData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  fecha: string;
  ciudad: string;
  hotel: string;
  lugaresAdicionales: Lugar[];
}

export function Crear() {
  const [crearData, setCrearData] = useState<CrearData>({
    id: Date.now(),
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
    fecha: "",
    ciudad: "",
    hotel: "",
    lugaresAdicionales: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setCrearData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddLugar = (lugar: Lugar): void => {
    setCrearData((prevData) => ({
      ...prevData,
      lugaresAdicionales: [...prevData.lugaresAdicionales, lugar],
    }));
    Swal.fire({
      icon: "success",
      title: "¡Lugar agregado!",
      text: "El lugar adicional se ha añadido correctamente",
      timer: 1500,
    });
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !crearData.nombre ||
      !crearData.email ||
      !crearData.telefono ||
      !crearData.pais ||
      !crearData.fecha ||
      !crearData.ciudad ||
      !crearData.hotel
    ) {
      Swal.fire("Error", "Todos los campos principales son obligatorios.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailLibre = crearData.email.trim().toLowerCase() === "flowmaticia@gmail.com";
      const telefonoLibre = crearData.telefono.trim().replace(/\s+/g, "") === "+34614394276";
    
      const datosCompletos = { ...crearData, timestamp: new Date() };
    
      await addDoc(collection(db, "informacion"), datosCompletos);
    
      await fetch(
        "https://appwebhookapp.flowmaticn8n.us/webhook/d8a36c09-92ca-4444-b475-f86290ee5b36",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosCompletos),
        }
      );
    
      await Swal.fire({
        icon: "success",
        title: emailLibre && telefonoLibre ? "¡Modo prueba activado!" : "¡Itinerario creado!",
        timer: 2000,
      });
    
      setCrearData({
        id: Date.now(),
        nombre: "",
        email: "",
        telefono: "",
        pais: "",
        fecha: "",
        ciudad: "",
        hotel: "",
        lugaresAdicionales: [],
      });
    } catch (error) {
      console.error("Error al guardar el itinerario:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar tu itinerario",
      });
    }
     finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crear-container">
      <h1>Construire un itinéraire</h1>
      <form onSubmit={handleSubmit} className="crear-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nom complet"
          value={crearData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={crearData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Numéro de téléphone"
          value={crearData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="pais"
          placeholder="Pays destination"
          value={crearData.pais}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha"
          value={crearData.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ville"
          value={crearData.ciudad}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hotel"
          placeholder="Hôtel"
          value={crearData.hotel}
          onChange={handleChange}
          required
        />

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-secondary"
        >
          Ajouter plus de lieux
        </button>

        {crearData.lugaresAdicionales.length > 0 && (
          <div className="lugares-adicionales">
            <h3>Lugares adicionales:</h3>
            <ul>
              {crearData.lugaresAdicionales.map((lugar, index) => (
                <li style={{ color: "black" }} key={index}>
                  {lugar.fecha} - {lugar.ciudad} ({lugar.hotel})
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Guardando..." : "Enregistrer l'itinéraire"}
        </button>
      </form>

      <Modal
        className="modal1"
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title style={{ color: "white" }}>
            Ajouter des lieux supplémentaires
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LugarForm onAddLugar={handleAddLugar} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowModal(false)} className="btn-secondary1">
            Fermer
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

interface LugarFormProps {
  onAddLugar: (lugar: Lugar) => void;
}

const LugarForm: React.FC<LugarFormProps> = ({ onAddLugar }) => {
  const [lugar, setLugar] = useState<Lugar>({
    fecha: "",
    ciudad: "",
    hotel: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLugar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lugar.fecha && lugar.ciudad && lugar.hotel) {
      onAddLugar(lugar);
      setLugar({ fecha: "", ciudad: "", hotel: "" });
    } else {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="lugar-form">
      <input
        type="date"
        name="fecha"
        value={lugar.fecha}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="ciudad"
        placeholder="Ville"
        value={lugar.ciudad}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="hotel"
        placeholder="Hôtel"
        value={lugar.hotel}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn-primary">
        Ajouter lieu
      </button>
    </form>
  );
};
