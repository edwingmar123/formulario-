// types.ts - Este archivo solo exporta interfaces y tipos
export interface IExperiencia {
    fecha: string;
    puesto: string;
    empleador: string;
    responsabilidades: string;
    sector: string;
  }
  
  export interface IEducacion {
    fecha: string;
    titulo: string;
    nivel: string;
    institucion: string;
    materias: string;
    logros: string;
  }
  
  export interface IIdioma {
    idioma: string;
    comprension: string;
    hablado: string;
    escrito: string;
    certificado: string;
  }
  
  export interface IFormulario {
    nombre: string;
    email: string;
    direccion: string;
    telefono: string;
    website: string;
    mensajeria: string;
    genero: string;
    fechaNacimiento: string;
    nacionalidad: string;
    puesto: string;
    declaracionPersonal: string;
    experiencias: IExperiencia[];
    educaciones: IEducacion[];
    idiomas: IIdioma[];
    habilidades: string;
    foto: string;
  }
  
  // Valores por defecto exportados como constantes
  export const emptyExperiencia: IExperiencia = {
    fecha: "",
    puesto: "",
    empleador: "",
    responsabilidades: "",
    sector: "",
  };
  
  export const emptyEducacion: IEducacion = {
    fecha: "",
    titulo: "",
    nivel: "",
    institucion: "",
    materias: "",
    logros: "",
  };
  
  export const emptyIdioma: IIdioma = {
    idioma: "",
    comprension: "",
    hablado: "",
    escrito: "",
    certificado: "",
  };
  
  export const initialFormState: IFormulario = {
    nombre: "",
    email: "",
    direccion: "",
    telefono: "",
    website: "",
    mensajeria: "",
    genero: "",
    fechaNacimiento: "",
    nacionalidad: "",
    puesto: "",
    declaracionPersonal: "",
    experiencias: [emptyExperiencia],
    educaciones: [emptyEducacion],
    idiomas: [emptyIdioma],
    habilidades: "",
    foto: "",
  };