import { useEffect, useState } from "react";
import { useAuth } from "./AutoContext";
import { User } from "firebase/auth";
import Swal from "sweetalert2";
import { db } from "./Credenciales";
import { doc, setDoc } from "firebase/firestore";
import {
  IFormulario,
  emptyExperiencia,
  emptyEducacion,
  emptyIdioma,
  initialFormState,
} from "./Interface";

// Ajusta el tipo del contexto retornado por useAuth

export function Formulario() {
  const [formulario, setFormulario] = useState<IFormulario>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authContext = useAuth();
  const currentUser = (authContext as any)?.currentUser as User | null;

  useEffect(() => {
    if (currentUser) {
      setFormulario((prev) => ({
        ...prev,
        nombre: currentUser.displayName || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = <T extends keyof IFormulario>(
    section: T,
    index: number,
    field: string,
    value: string
  ) => {
    const newArray = [...(formulario[section] as any[])];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormulario((prev) => ({ ...prev, [section]: newArray }));
  };

  const addNewItem = (
    section: keyof Pick<IFormulario, "experiencias" | "educaciones" | "idiomas">
  ) => {
    const templates = {
      experiencias: emptyExperiencia,
      educaciones: emptyEducacion,
      idiomas: emptyIdioma,
    };
    setFormulario((prev) => ({
      ...prev,
      [section]: [...prev[section], templates[section]],
    }));
  };

  const removeItem = (
    section: keyof Pick<
      IFormulario,
      "experiencias" | "educaciones" | "idiomas"
    >,
    index: number
  ) => {
    setFormulario((prev) => {
      const updated = [...prev[section]];
      updated.splice(index, 1);
      return { ...prev, [section]: updated };
    });
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
    if (!formulario.nombre || !formulario.email || !formulario.puesto) {
      Swal.fire({
        icon: "error",
        title: "Campos requeridos",
        text: "Nombre, email y puesto son campos obligatorios",
      });
      return false;
    }

    if (formulario.telefono && !/^\d{10,15}$/.test(formulario.telefono)) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "El teléfono debe tener entre 10 y 15 dígitos numéricos",
      });
      return false;
    }

    if (
      formulario.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)
    ) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor ingresa un email válido",
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
      if (!e.currentTarget.checkValidity()) {
        e.stopPropagation();
        throw new Error("Por favor completa todos los campos requeridos");
      }

      const data = { ...formulario };

      const randomId = Date.now().toString();
      const userDocRef = doc(db, "usercv", randomId);
      await setDoc(userDocRef, data, { merge: true });

      await fetch(
        "https://edwing111.app.n8n.cloud/webhook-test/cv-formulario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      await Swal.fire({
        icon: "success",
        title: "CV Guardado",
        text: "Tu información se ha guardado correctamente",
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
            : "Ocurrió un error al guardar tu CV",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="form-container">
      <h1>Formulario de CV Profesional</h1>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Información Personal</h2>
        <div className="form-section">
          <div className="form-group">
            <label className="required">Nombre completo</label>
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
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formulario.direccion}
              onChange={handleChange}
              placeholder="Número, calle, ciudad, código postal, país"
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formulario.telefono}
              onChange={handleChange}
              pattern="[0-9]{10,15}"
              title="10-15 dígitos numéricos"
              placeholder="Ej: 1234567890"
            />
          </div>

          <div className="form-group">
            <label>Sitio web</label>
            <input
              type="url"
              name="website"
              value={formulario.website}
              onChange={handleChange}
              placeholder="https://tusitio.com"
            />
          </div>

          <div className="form-group">
            <label>Cuenta de mensajería</label>
            <input
              type="text"
              name="mensajeria"
              value={formulario.mensajeria}
              onChange={handleChange}
              placeholder="Ej: WhatsApp, Telegram"
            />
          </div>

          <div className="form-group">
            <label>Género</label>
            <select
              name="genero"
              value={formulario.genero}
              onChange={handleChange}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formulario.fechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nacionalidad</label>
            <input
              type="text"
              name="nacionalidad"
              value={formulario.nacionalidad}
              onChange={handleChange}
              placeholder="Ej: Mexicana"
            />
          </div>

          <div className="form-group">
            <label>Foto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formulario.foto && (
              <img
                src={formulario.foto}
                alt="Preview"
                className="photo-preview"
              />
            )}
          </div>
        </div>

        {/* Sección de Puesto Solicitado */}
        <h2>Puesto solicitado</h2>
        <div className="form-section">
          <div className="form-group">
            <label className="required">
              Puesto/Posición/Estudios aplicados
            </label>
            <input
              type="text"
              name="puesto"
              value={formulario.puesto}
              onChange={handleChange}
              required
              placeholder="Ej: Desarrollador Frontend"
            />
          </div>

          <div className="form-group">
            <label>Declaración personal</label>
            <textarea
              name="declaracionPersonal"
              value={formulario.declaracionPersonal}
              onChange={handleChange}
              rows={4}
              placeholder="Breve resumen de tus objetivos profesionales"
            />
          </div>
        </div>

        {/* Sección de Experiencia Laboral */}
        <h2>Experiencia laboral</h2>
        {formulario.experiencias.map((exp, index) => (
          <div key={index} className="form-section array-item">
            <div className="form-group">
              <label>Fecha (Desde - Hasta)</label>
              <input
                type="text"
                value={exp.fecha}
                onChange={(e) =>
                  handleArrayChange(
                    "experiencias",
                    index,
                    "fecha",
                    e.target.value
                  )
                }
                placeholder="MM/AAAA - MM/AAAA"
              />
            </div>

            <div className="form-group">
              <label>Puesto ocupado</label>
              <input
                type="text"
                value={exp.puesto}
                onChange={(e) =>
                  handleArrayChange(
                    "experiencias",
                    index,
                    "puesto",
                    e.target.value
                  )
                }
                placeholder="Ej: Desarrollador Frontend"
              />
            </div>

            <div className="form-group">
              <label>Empleador</label>
              <input
                type="text"
                value={exp.empleador}
                onChange={(e) =>
                  handleArrayChange(
                    "experiencias",
                    index,
                    "empleador",
                    e.target.value
                  )
                }
                placeholder="Nombre de la empresa"
              />
            </div>

            <div className="form-group">
              <label>Responsabilidades</label>
              <textarea
                value={exp.responsabilidades}
                onChange={(e) =>
                  handleArrayChange(
                    "experiencias",
                    index,
                    "responsabilidades",
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Describe tus responsabilidades en este puesto"
              />
            </div>

            <div className="form-group">
              <label>Sector</label>
              <input
                type="text"
                value={exp.sector}
                onChange={(e) =>
                  handleArrayChange(
                    "experiencias",
                    index,
                    "sector",
                    e.target.value
                  )
                }
                placeholder="Ej: Tecnología, Salud, Educación"
              />
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeItem("experiencias", index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => addNewItem("experiencias")}
        >
          + Añadir Experiencia
        </button>

        {/* Sección de Educación */}
        <h2>Educación y formación</h2>
        {formulario.educaciones.map((edu, index) => (
          <div key={index} className="form-section array-item">
            <div className="form-group">
              <label>Fecha (Desde - Hasta)</label>
              <input
                type="text"
                value={edu.fecha}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "fecha",
                    e.target.value
                  )
                }
                placeholder="MM/AAAA - MM/AAAA"
              />
            </div>

            <div className="form-group">
              <label>Título obtenido</label>
              <input
                type="text"
                value={edu.titulo}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "titulo",
                    e.target.value
                  )
                }
                placeholder="Ej: Licenciatura en Informática"
              />
            </div>

            <div className="form-group">
              <label>Nivel EQF (si aplica)</label>
              <input
                type="text"
                value={edu.nivel}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "nivel",
                    e.target.value
                  )
                }
                placeholder="Ej: Nivel 5"
              />
            </div>

            <div className="form-group">
              <label>Institución</label>
              <input
                type="text"
                value={edu.institucion}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "institucion",
                    e.target.value
                  )
                }
                placeholder="Nombre de la institución"
              />
            </div>

            <div className="form-group">
              <label>Materias principales/habilidades</label>
              <textarea
                value={edu.materias}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "materias",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="Lista de materias relevantes o habilidades adquiridas"
              />
            </div>

            <div className="form-group">
              <label>Logros</label>
              <textarea
                value={edu.logros}
                onChange={(e) =>
                  handleArrayChange(
                    "educaciones",
                    index,
                    "logros",
                    e.target.value
                  )
                }
                rows={2}
                placeholder="Premios, reconocimientos o logros especiales"
              />
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeItem("educaciones", index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => addNewItem("educaciones")}
        >
          + Añadir Educación
        </button>

        {/* Sección de Idiomas */}
        <h2>Idiomas</h2>
        {formulario.idiomas.map((idioma, index) => (
          <div key={index} className="form-section array-item">
            <div className="form-group">
              <label>Idioma</label>
              <input
                type="text"
                value={idioma.idioma}
                onChange={(e) =>
                  handleArrayChange("idiomas", index, "idioma", e.target.value)
                }
                placeholder="Ej: Inglés"
              />
            </div>

            <div className="form-group">
              <label>Comprensión auditiva</label>
              <select
                value={idioma.comprension}
                onChange={(e) =>
                  handleArrayChange(
                    "idiomas",
                    index,
                    "comprension",
                    e.target.value
                  )
                }
              >
                <option value="">Nivel</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expresión oral</label>
              <select
                value={idioma.hablado}
                onChange={(e) =>
                  handleArrayChange("idiomas", index, "hablado", e.target.value)
                }
              >
                <option value="">Nivel</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expresión escrita</label>
              <select
                value={idioma.escrito}
                onChange={(e) =>
                  handleArrayChange("idiomas", index, "escrito", e.target.value)
                }
              >
                <option value="">Nivel</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div className="form-group">
              <label>Certificado (si aplica)</label>
              <input
                type="text"
                value={idioma.certificado}
                onChange={(e) =>
                  handleArrayChange(
                    "idiomas",
                    index,
                    "certificado",
                    e.target.value
                  )
                }
                placeholder="Nombre del certificado y nivel"
              />
            </div>

            <button
              type="button"
              className="remove-btn"
              onClick={() => removeItem("idiomas", index)}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => addNewItem("idiomas")}
        >
          + Añadir Idioma
        </button>

        {/* Sección de Habilidades */}
        <h2>Habilidades personales</h2>
        <div className="form-section">
          <div className="form-group">
            <label>Habilidades y competencias</label>
            <textarea
              name="habilidades"
              value={formulario.habilidades}
              onChange={handleChange}
              rows={4}
              placeholder="Ej: 
* Buenas habilidades de comunicación adquiridas como gerente de ventas
* Dominio de React y TypeScript
* Capacidad para trabajar en equipo"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Procesando...
              </>
            ) : (
              "Guardar CV"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
