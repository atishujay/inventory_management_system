import { useEffect, useState } from "react";
import api from "../api/api";

export default function DashboardCards() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/orders").then((res) => setOrders(res.data));
  }, []);

  const cardStyle = {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    width: "200px",
    background: "white",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      
      {/* PRODUCTS */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          📦 Products
        </div>
        <h2>{products.length}</h2>
      </div>

      {/* CUSTOMERS */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          👤 Customers
        </div>
        <h2>{customers.length}</h2>
      </div>

      {/* ORDERS */}
      <div style={cardStyle}>
        <div style={labelStyle}>
          🛒 Orders
        </div>
        <h2>{orders.length}</h2>
      </div>

    </div>
  );
}