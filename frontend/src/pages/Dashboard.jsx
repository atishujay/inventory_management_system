import { useEffect, useState } from "react";
import api from "../api/api";

import { Package, Users, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/orders").then((res) => setOrders(res.data));
    api.get("/products/low-stock").then((res) => setLowStockProducts(res.data));
  }, []);

  const containerStyle = {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  };

  const baseCard = {
    flex: 1,
    minWidth: "220px",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  };

  const textStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "14px",
    opacity: 0.9,
  };

  const valueStyle = {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
  };

  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>

      <div style={containerStyle}>
        
        {/* PRODUCTS */}
        <div
          style={{
            ...baseCard,
            background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
          }}
        >
          <div style={textStyle}>
            <p style={titleStyle}>Total Products</p>
            <h2 style={valueStyle}>{products.length}</h2>
          </div>
          <Package size={34} />
        </div>

        {/* CUSTOMERS */}
        <div
          style={{
            ...baseCard,
            background: "linear-gradient(135deg, #10b981, #34d399)",
          }}
        >
          <div style={textStyle}>
            <p style={titleStyle}>Total Customers</p>
            <h2 style={valueStyle}>{customers.length}</h2>
          </div>
          <Users size={34} />
        </div>

        {/* ORDERS */}
                {/* ORDERS */}
        <div
          style={{
            ...baseCard,
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          }}
        >
          <div style={textStyle}>
            <p style={titleStyle}>Total Orders</p>
            <h2 style={valueStyle}>{orders.length}</h2>
          </div>
          <ShoppingCart size={34} />
        </div>

      </div>

      <h2 style={{ marginTop: "40px" }}>Low Stock Products</h2>

      {lowStockProducts.length === 0 ? (
        <p>No low stock products</p>
      ) : (
        lowStockProducts.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              backgroundColor: "#fff3cd",
            }}
          >
            <h3>{product.name}</h3>

            <p>
              <strong>Product ID:</strong> {product.id}
            </p>

            <p>
              <strong>SKU:</strong> {product.sku}
            </p>

            <p>
              <strong>Stock Remaining:</strong> {product.quantity}
            </p>
          </div>
        ))
      )}

    </div>
  );
}