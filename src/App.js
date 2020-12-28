import React from 'react'
import './App.css';
import PlanetGame from './modules/planetGenerator/PlanetGame'
/* Mòdul principal del simulador, carrega el component PlanetGame que carrega la resta de components necessaris */
function App() {
  return (
    <div className="App">
      <PlanetGame />      
    </div>
  );
}

export default App;
