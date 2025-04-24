import { Formulario } from "./assets/components/Formulario";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/formulario" replace />} />
        <Route path="/formulario" element={<Formulario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

