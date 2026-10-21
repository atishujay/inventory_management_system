import { Link } from "react-router-dom";

export default function Navbar() {
  const navStyle = {
    background: "linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)",
    padding: "14px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "white",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  const linkContainer = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "0.3s",
  };

  const handleHover = (e) => {
    e.target.style.background = "rgba(255,255,255,0.25)";
    e.target.style.color = "#ffffff";
  };

  const handleLeave = (e) => {
    e.target.style.background = "transparent";
    e.target.style.color = "rgba(255,255,255,0.9)";
  };

  return (
    <nav style={navStyle}>
      {/* Title */}
      <div style={titleStyle}>Inventory Management System</div>

      {/* Links */}
      <div style={linkContainer}>
        <Link to="/" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          Dashboard
        </Link>

        <Link to="/Products" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          Products
        </Link>

        <Link to="/Customers" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          Customers
        </Link>

        <Link to="/Orders" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          Orders
        </Link>

        <Link to="/ArchivedProducts" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          Archived
        </Link>
      </div>
    </nav>
  );
}