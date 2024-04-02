import React from "react";
// Importera inte Routes och Route här längre
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // Använd Outlet för att rendera child routes
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <div className="App">
      <Header title="React Blog" />
      <DataProvider>
        <Nav />
        <Outlet /> {/* Child routes renderas här */}
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
