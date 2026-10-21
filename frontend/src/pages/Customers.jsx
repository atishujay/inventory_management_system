import { useEffect, useState } from "react";
import api from "../api/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const fetchCustomers = () => {
    api.get("/customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteCustomer = (id) => {
    api.delete(`/customers/${id}`)
      .then(() => {
        alert("Customer Deleted Successfully");
        fetchCustomers();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Deleting Customer");
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCustomer = {
      full_name: fullName,
      email: email,
      phone: phone,
    };

    api.post("/customers", newCustomer)
      .then(() => {
        alert("Customer Added Successfully");

        setFullName("");
        setEmail("");
        setPhone("");

        fetchCustomers();
      })
      .catch((error) => {
        console.log(error);
        alert("Error Adding Customer");
      });
  };

  return (
    <div>
      <h1>Customers</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Add Customer</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            width: "300px",
          }}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add Customer
        </button>
      </form>

      {customers.length === 0 ? (
        <p>No customers found</p>
      ) : (
        customers.map((customer) => (
          <div
            key={customer.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{customer.full_name}</h3>

            <p>
              <strong>Customer ID:</strong> {customer.id}
            </p>

            <p>
              <strong>Email:</strong> {customer.email}
            </p>

            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>

            <button
              onClick={() => deleteCustomer(customer.id)}
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
              Delete Customer
            </button>
          </div>
        ))
      )}
    </div>
  );
}