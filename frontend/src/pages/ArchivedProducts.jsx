import { useEffect, useState } from "react";
import api from "../api/api";

export default function ArchivedProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    api.get("/products/archived")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const restoreProduct = (id) => {
    api.put(`/products/${id}/restore`)
      .then(() => {
        alert("Product Restored Successfully");
        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Restoring Product");
      });
  };

  const permanentDeleteProduct = (id) => {
    if (
      !window.confirm(
        "Are you sure? This product will be permanently deleted."
      )
    ) {
      return;
    }

    api.delete(`/products/${id}/permanent`)
      .then(() => {
        alert("Product Permanently Deleted");
        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Deleting Product");
      });
  };

  return (
    <div>
      <h1>Archived Products</h1>

      {products.length === 0 ? (
        <p>No Archived Products Found</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
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
              <strong>Price:</strong> ₹{product.price}
            </p>

            <p>
              <strong>Stock:</strong> {product.quantity}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px"
              }}
            >
              <button
                onClick={() => restoreProduct(product.id)}
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Restore Product
              </button>

              <button
                onClick={() => permanentDeleteProduct(product.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}