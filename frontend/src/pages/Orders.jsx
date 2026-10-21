import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchOrders = () => {
    api.get("/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOrder = (id) => {
    api.delete(`/orders/${id}`)
      .then(() => {
        alert("Order Deleted Successfully");
        fetchOrders();

        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(null);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error Deleting Order");
      });
  };

  const viewOrderDetails = (id) => {
    api.get(`/orders/${id}`)
      .then((response) => {
        setSelectedOrder(response.data);
      })
      .catch((error) => {
        console.log(error);
        alert("Error Loading Order Details");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      customer_id: Number(customerId),
      items: [
        {
          product_id: Number(productId),
          quantity: Number(quantity),
        },
      ],
    };

    api.post("/orders", newOrder)
      .then(() => {
        alert("Order Created Successfully");

        setCustomerId("");
        setProductId("");
        setQuantity("");

        fetchOrders();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Creating Order");
      });
  };

  return (
    <div>
      <h1>Orders</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Create Order</h2>

        <input
          type="number"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
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
            background: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Create Order
        </button>
      </form>

      {selectedOrder && (
        <div
          style={{
            border: "2px solid green",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Order Details</h2>

          <p>Order ID: {selectedOrder.id}</p>

          <p>
            Customer Name: {selectedOrder.customer_name}
          </p>

          <p>
            Total Amount: ₹{selectedOrder.total_amount}
          </p>

          {selectedOrder.items &&
            selectedOrder.items.map((item) => (
              <div key={item.id}>
                <p>Product Name : {item.product_name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
                <hr />
              </div>
            ))}
        </div>
      )}

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Order #{order.id}</h3>

            <p>
              <strong>Customer ID:</strong> {order.customer_id}
            </p>

            <p>
              <strong>Total Amount:</strong> ₹{order.total_amount}
            </p>

            <button
              onClick={() => viewOrderDetails(order.id)}
              style={{
                background: "blue",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              View Details
            </button>

            <button
              onClick={() => deleteOrder(order.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}