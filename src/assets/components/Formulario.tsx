import { useState } from "react";
import { Crear } from "./Crear";
import Swal from "sweetalert2";
import { db } from "./Credenciales";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Captura from "../img/Captura .png";
import { IFormulario, initialFormState } from "./Interface";

export function Formulario() {
  const [formulario, setFormulario] = useState<IFormulario>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("informacion");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const usuarioYaRegistrado = async (email: string, telefono: string) => {
    const informacionRef = collection(db, "informacion");
    const q = query(
      informacionRef,
      where("email", "==", email),
      where("telefono", "==", telefono)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Archivo demasiado grande",
        text: "Por favor selecciona una imagen menor a 2MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormulario((prev) => ({ ...prev, foto: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    if (!formulario.nombre) {
      Swal.fire({
        icon: "error",
        title: "Campo requerido",
        text: "El nombre es obligatorio",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const yaRegistrado = await usuarioYaRegistrado(
        formulario.email,
        formulario.telefono
      );

      if (yaRegistrado) {
        await Swal.fire({
          icon: "warning",
          title: "Ya usó su prueba",
          text: "Este correo o número ya está registrado.",
        });
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(db, "informacion"), { ...formulario });

      await fetch(
        "https://appn8napp.flowmaticn8n.us/webhook-test/d8a36c09-92ca-4444-b475-f86290ee5b36",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulario),
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Información guardada",
        text: "Tus datos se han guardado correctamente",
        timer: 2000,
      });

      setFormulario(initialFormState);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al guardar tu información",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo">
      <div className="formulario">
        <div className="logo-container ">
          <img style={{ width: "600px", objectFit: "contain" }}
            src="https://res.cloudinary.com/dcyuqvulc/image/upload/v1751632261/FullLogo_Transparent_18_nsovdv.png"
            alt="Logo"
          />

          <img
            style={{
              width: "60px",
              
              objectFit: "contain",
              position: "absolute",
              left: "350px",
              border :"3px solid white",
              borderRadius: "50%",
              marginTop: "-9px ",
              marginLeft: "90px",
            }}
            src="https://res.cloudinary.com/dcyuqvulc/image/upload/v1746187223/Disen%CC%83o_sin_ti%CC%81tulo_8_4_kps5o4.png"
            alt=""
          />
          <p style={{ position: "absolute", fontSize: "10px",width: "150px", left: "400px", marginTop: "-120px" }} >Fondatrice Flowmatic Expert Automatisation IA </p>

          <img
            style={{
              width: "400px",
              height: "300px ",
              position: "absolute",
              objectFit: "contain",
              marginTop: "-120px ",
              marginLeft: "-570px",
            }}
            src="https://res.cloudinary.com/dcyuqvulc/image/upload/v1751632193/FullLogo_Transparent_17_rnnma4.png"
            alt=""
          />
        </div>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "informacion" ? "active" : ""}`}
            onClick={() => setActiveTab("informacion")}
          >
            Itinéraire
          </button>
          <button
            className={`tab-btn ${activeTab === "itinerario" ? "active" : ""}`}
            onClick={() => setActiveTab("itinerario")}
          >
            Construire l'itinéraire
          </button>
        </div>

        {activeTab === "informacion" && (
          <div className="form-content">
            <h1 className="form-title">Informations pour l'itinéraire</h1>
            <form
              style={{ borderRadius: "12px" }}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-grid">
                <div className="form-group">
                  <label className="required">Nom complet</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div className="form-group">
                  <label className="required">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formulario.email}
                    onChange={handleChange}
                    required
                    placeholder="Ej: ejemplo@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="required">Téléphone</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 1234567890"
                  />
                </div>
                <div className="form-group">
                  <label className="required">Pays destination</label>
                  <input
                    type="text"
                    name="pais"
                    value={formulario.pais}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Pays"
                  />
                </div>
                <div className="form-group">
                  <label>Photo</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span>
                      Faites glisser ou cliquez pour télécharger une photo
                    </span>
                  </div>
                  {formulario.foto && (
                    <div className="preview-img">
                      <img src={formulario.foto} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="image-example">
                <h3>Exemple d'image pour l'itinéraire à télécharger:</h3>
                <div className="image-container">
                  <img src={Captura} alt="Ejemplo de itinerario" />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      Procesando...
                    </div>
                  ) : (
                    "Enregistrer les informations"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "itinerario" && (
          <div className="form-content">
            <Crear />
          </div>
        )}
      </div>
      <p style={{ textAlign: "center", marginTop: "-28px" }}>
        © 2025 Flowmatic – L'IA au service des Pros du Tourisme
      </p>
    </div>
  );
}
