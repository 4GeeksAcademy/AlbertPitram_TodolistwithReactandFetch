import React from "react";
import ReactDOM from "react-dom/client";

// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../styles/index.css";

// Importa aquí tu componente Todolist desde la carpeta pages
import Todolist from "./components/Todolist";

// Renderiza el componente principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Todolist />
  </React.StrictMode>
);
