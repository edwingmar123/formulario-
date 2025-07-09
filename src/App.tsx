import { Formulario } from "./assets/components/Formulario";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Crear} from "./assets/components/Crear"
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/formulario" replace />} />
        <Route path="/formulario" element={<Formulario />} />
        
        <Route path="/crear" element={<Crear />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
