import React, { useEffect, useState } from "react";
import API from "./api";
import "./App.css";

function App() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });

  const [leads, setLeads] = useState([]);

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leads");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add Lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    // Validation
    if (!name) {
      setError("Name is required");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    try {
      await API.post("/leads", {
        ...form,
        name,
        phone,
      });

      setSuccess("Lead added successfully");

      setForm({
        name: "",
        phone: "",
        source: "Call",
      });

      fetchLeads();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}`, { status });

      setSuccess("Status updated");

      fetchLeads();

    } catch (err) {
      console.error(err);

      setError("Failed to update status");
    }
  };

  // Delete Lead
  const deleteLead = async (id) => {
    try {
      await API.delete(`/leads/${id}`);

      setSuccess("Lead deleted");

      fetchLeads();

    } catch (err) {
      console.error(err);

      setError("Failed to delete lead");
    }
  };

  // Dashboard Stats
  const totalLeads = leads.length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  const notInterestedLeads = leads.filter(
    (lead) => lead.status === "Not Interested"
  ).length;

  // Search + Filter
  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">

      <h1>Lead Management System</h1>

      {/* Dashboard */}

      <div className="dashboard">

        <div className="dashboard-card total">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="dashboard-card interested">
          <h3>Interested</h3>
          <p>{interestedLeads}</p>
        </div>

        <div className="dashboard-card converted">
          <h3>Converted</h3>
          <p>{convertedLeads}</p>
        </div>

        <div className="dashboard-card not-interested">
          <h3>Not Interested</h3>
          <p>{notInterestedLeads}</p>
        </div>

      </div>

      {/* Error Message */}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {/* Success Message */}

      {success && (
        <p className="success">
          {success}
        </p>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="lead-form"
      >

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        <select
          value={form.source}
          onChange={(e) =>
            setForm({
              ...form,
              source: e.target.value,
            })
          }
        >
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button type="submit">
          Add Lead
        </button>

      </form>

      {/* Search & Filter */}

      <div className="filters">

        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Interested">
            Interested
          </option>

          <option value="Not Interested">
            Not Interested
          </option>

          <option value="Converted">
            Converted
          </option>

        </select>

      </div>

      {/* Leads List */}

      <div className="lead-list">

        {filteredLeads.length === 0 ? (
          <p>No leads found</p>
        ) : (
          filteredLeads.map((lead) => (

            <div
              className="lead-card"
              key={lead.id}
            >

              <h3>{lead.name}</h3>

              <p>{lead.phone}</p>

              <p>
                Source: {lead.source}
              </p>

              <p>
                Status:
              </p>

              <select
                value={lead.status}
                onChange={(e) =>
                  updateStatus(
                    lead.id,
                    e.target.value
                  )
                }
              >
                <option>
                  Interested
                </option>

                <option>
                  Not Interested
                </option>

                <option>
                  Converted
                </option>

              </select>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteLead(lead.id)
                }
              >
                Delete
              </button>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;