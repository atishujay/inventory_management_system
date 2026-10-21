import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import ArchivedProducts from "./pages/ArchivedProducts";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Customers" element={<Customers />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/ArchivedProducts" element={<ArchivedProducts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;