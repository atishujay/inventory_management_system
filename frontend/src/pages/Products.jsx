import { useEffect, useState } from "react";
import api from "../api/api";

export default function Products() {
const [products, setProducts] = useState([]);
const [editingId, setEditingId] = useState(null);
const [name, setName] = useState("");
const [sku, setSku] = useState("");
const [price, setPrice] = useState("");
const [quantity, setQuantity] = useState("");
const [editName, setEditName] = useState("");
const [editSku, setEditSku] = useState("");
const [editPrice, setEditPrice] = useState("");
const [editQuantity, setEditQuantity] = useState("");

const fetchProducts = () => {
  api.get("/products")
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};


const startEdit = (product) => {
  setEditingId(product.id);

  setEditName(product.name);
  setEditSku(product.sku);
  setEditPrice(product.price);
  setEditQuantity(product.quantity);
};

const updateProduct = (id) => {
  const updatedProduct = {
    name: editName,
    sku: editSku,
    price: Number(editPrice),
    quantity: Number(editQuantity),
  };

  api.put(`/products/${id}`, updatedProduct)
    .then(() => {
      alert("Product Updated Successfully");

      setEditingId(null);

      fetchProducts();
    })
    .catch((error) => {
      console.log(error);
      alert("Error Updating Product");
    });
};


const deleteProduct = (id) => {
  api.delete(`/products/${id}`)
    .then(() => {
      alert("Product Deleted Successfully");
      fetchProducts();
    })
    .catch((error) => {
      console.log(error);
      alert("Error Deleting Product");
    });
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      sku,
      price: Number(price),
      quantity: Number(quantity),
    };

    api.post("/products", newProduct)
      .then(() => {
        alert("Product Added Successfully");

        setName("");
        setSku("");
        setPrice("");
        setQuantity("");

        fetchProducts();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Adding Product");
      });
  };

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Products</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Add Product</h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add Product
        </button>
      </form>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {editingId === product.id ? (
  <>
    <input
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      style={{
        display: "block",
        marginBottom: "10px",
        padding: "8px",
        width: "300px",
      }}
    />

    <input
      value={editSku}
      onChange={(e) => setEditSku(e.target.value)}
      style={{
        display: "block",
        marginBottom: "10px",
        padding: "8px",
        width: "300px",
      }}
    />

    <input
      type="number"
      value={editPrice}
      onChange={(e) => setEditPrice(e.target.value)}
      style={{
        display: "block",
        marginBottom: "10px",
        padding: "8px",
        width: "300px",
      }}
    />

    <input
      type="number"
      value={editQuantity}
      onChange={(e) => setEditQuantity(e.target.value)}
      style={{
        display: "block",
        marginBottom: "10px",
        padding: "8px",
        width: "300px",
      }}
    />

    <button
      onClick={() => updateProduct(product.id)}
      style={{
        background: "green",
        color: "white",
        border: "none",
        padding: "8px 15px",
        borderRadius: "5px",
      }}
    >
      Save Changes
    </button>
  </>
) : (
  <>
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
  </>
)}

            <button
  onClick={() => startEdit(product)}
  style={{
    background: "orange",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "10px",
  }}
>
  Edit Product
</button>

<button
  onClick={() => deleteProduct(product.id)}
  style={{
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Delete Product
</button>
          </div>
        ))
      )}
    </div>
  );
}