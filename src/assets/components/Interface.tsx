// types.ts - Este archivo solo exporta interfaces y tipos

  
  
  
  export interface IFormulario {
    nombre: string;
    email: string;
    telefono: string;
    pais: string;
    foto: string;
  }
  
  
  
  export const initialFormState: IFormulario = {
    nombre: "", 
    email: "",
    telefono: "",
    pais: "",
    foto: "",
  };