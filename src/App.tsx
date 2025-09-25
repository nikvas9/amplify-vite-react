import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function formatDateCell(dateString?: string) {
  if (!dateString) return { display: "", tooltip: "" };
  const date = new Date(dateString);
  const display = `${date.getFullYear()}-${date.toLocaleString("en-US", { month: "short" })}-${String(date.getDate()).padStart(2, "0")}`;
  const tooltip = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return { display, tooltip };
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [filteredTodos, setFilteredTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [drivers, setDrivers] = useState<Array<Schema["Driver"]["type"]>>([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLicense, setShowLicense] = useState<{[key: string]: boolean}>({});
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    userName: "",
    driverName: "",
    phoneNumber: "",
    truckSize: "",
    status: "In Progress"
  });
  const [editFormData, setEditFormData] = useState({
    content: "",
    userName: "",
    driverName: "",
    phoneNumber: "",
    truckSize: "",
    status: "In Progress"
  });
  const [originalData, setOriginalData] = useState({
    content: "",
    userName: "",
    driverName: "",
    phoneNumber: "",
    truckSize: "",
    status: "In Progress"
  });
  const [driverFormData, setDriverFormData] = useState({
    name: "",
    phoneNumber: "",
    vehicleNumber: "",
    vehicleSize: "",
    maxLoad: "1 Ton",
    aadharNumber: "",
    licenseNumber: ""
  });
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const subscription = client.models.Driver.observeQuery().subscribe({
      next: (data) => setDrivers([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = todos.filter(todo => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return (
        (todo.content || "").toLowerCase().includes(searchTerm) ||
        (todo.userName || "").toLowerCase().includes(searchTerm) ||
        (todo.driverName || "").toLowerCase().includes(searchTerm) ||
        (todo.phoneNumber || "").includes(filter) ||
        (todo.truckSize || "").toLowerCase().includes(searchTerm) ||
        (todo.status || "").toLowerCase().includes(searchTerm)
      );
    });

    if (sortField) {
      filtered.sort((a, b) => {
        if (sortField === "status") {
          const aStatus = a.status || "";
          const bStatus = b.status || "";
          const aIndex = statusOrder.indexOf(aStatus);
          const bIndex = statusOrder.indexOf(bStatus);
          const comparison = aIndex - bIndex;
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
          const aVal = a[sortField as keyof typeof a] || "";
          const bVal = b[sortField as keyof typeof b] || "";
          const comparison = aVal.toString().localeCompare(bVal.toString());
          return sortDirection === "asc" ? comparison : -comparison;
        }
      });
    }

    setFilteredTodos(filtered);
  }, [todos, filter, sortField, sortDirection]);

  const statusOrder = ["Pending Payment", "Blocked", "Vehicle Repair", "In Progress", "Completed"];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  function generateCustomId() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const datePrefix = `${year}-${month}${day}`;
    
    // Find existing todos with today's date
    const todayTodos = todos.filter(todo => todo.customId?.startsWith(datePrefix));
    const sequence = todayTodos.length + 1;
    
    return `${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  function createTodo() {
    setShowModal(true);
  }

  function createDriver() {
    setShowDriverModal(true);
  }

  function handleDriverSubmit(e: React.FormEvent) {
    e.preventDefault();
    client.models.Driver.create({
      name: driverFormData.name,
      phoneNumber: driverFormData.phoneNumber,
      vehicleNumber: driverFormData.vehicleNumber,
      vehicleSize: driverFormData.vehicleSize,
      maxLoad: driverFormData.maxLoad,
      aadharNumber: driverFormData.aadharNumber,
      licenseNumber: driverFormData.licenseNumber,
      isActive: true
    })
    .then(() => {
      setShowDriverModal(false);
      setDriverFormData({
        name: "",
        phoneNumber: "",
        vehicleNumber: "",
        vehicleSize: "",
        maxLoad: "1 Ton",
        aadharNumber: "",
        licenseNumber: ""
      });
    })
    .catch((err) => alert("Failed to create driver: " + err.message));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Form data:", formData);
    
    const customId = generateCustomId();
    console.log("Generated customId:", customId);

    const todoData = {
      content: formData.content,
      userName: formData.userName,
      driverName: formData.driverName,
      phoneNumber: formData.phoneNumber,
      truckSize: formData.truckSize,
      status: formData.status,
      customId: customId,
    };
    
    console.log("Creating todo with data:", todoData);

    client.models.Todo.create(todoData)
    .then((result) => {
      console.log("Todo created successfully:", result);
      setShowModal(false);
      setFormData({
        content: "",
        userName: "",
        driverName: "",
        phoneNumber: "",
        truckSize: "",
        status: "In Progress"
      });
    })
    .catch((err) => {
      console.error("Create failed:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      alert("Create failed: " + (err.message || err));
    });
  }

  function updateTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const todoData = {
      content: todo.content || "",
      userName: todo.userName || "",
      driverName: todo.driverName || "",
      phoneNumber: todo.phoneNumber || "",
      truckSize: todo.truckSize || "",
      status: todo.status || "In Progress"
    };
    
    setEditFormData(todoData);
    setOriginalData(todoData);
    setEditingTodo(id);
    setShowEditModal(true);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTodo) return;

    client.models.Todo.update({
      id: editingTodo,
      content: editFormData.content,
      userName: editFormData.userName,
      driverName: editFormData.driverName,
      phoneNumber: editFormData.phoneNumber,
      truckSize: editFormData.truckSize,
      status: editFormData.status,
    })
    .then(() => {
      console.log("Todo updated!");
      setShowEditModal(false);
      setEditingTodo(null);
    })
    .catch((err) => {
      console.error("Update failed:", err);
      alert("Update failed: " + err.message);
    });
  }

  function hasChanges() {
    return Object.keys(editFormData).some(key => 
      editFormData[key as keyof typeof editFormData] !== originalData[key as keyof typeof originalData]
    );
  }

  function handleEditCancel() {
    if (hasChanges()) {
      setShowConfirmModal(true);
    } else {
      setShowEditModal(false);
    }
  }

  function confirmExit() {
    setShowConfirmModal(false);
    setShowEditModal(false);
  }

  function deleteTodo(id: string) {
    setDeletingTodo(id);
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (deletingTodo) {
      client.models.Todo.delete({ id: deletingTodo });
      setShowDeleteModal(false);
      setDeletingTodo(null);
    }
  }

  function exportToCSV() {
    const headers = ['Custom ID', 'Content', 'User Name', 'Driver Name', 'Phone Number', 'Truck Size', 'Status', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...filteredTodos.map(todo => [
        `"${todo.customId || todo.id || ''}"`,
        `"${(todo.content || '').replace(/"/g, '""')}"`,
        `"${(todo.userName || '').replace(/"/g, '""')}"`,
        `"${(todo.driverName || '').replace(/"/g, '""')}"`,
        `"${(todo.phoneNumber || '').replace(/"/g, '""')}"`,
        `"${(todo.truckSize || '').replace(/"/g, '""')}"`,
        `"${(todo.status || '').replace(/"/g, '""')}"`,
        `"${todo.updatedAt ? new Date(todo.updatedAt).toLocaleString() : ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    a.download = `${timestamp}_trips.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>
          {user?.attributes?.name || user?.signInDetails?.loginId || 'User'}'s list of rides
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Filter todos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button onClick={createTodo} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>+ Add Ride</button>
          <button onClick={createDriver} style={{ backgroundColor: "#17a2b8", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>+ Add Driver</button>
          <button onClick={exportToCSV} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>⬇️ Export</button>
          <div style={{ display: "flex", border: "1px solid #ccc", borderRadius: "4px", overflow: "hidden" }}>
            <button 
              onClick={() => setShowDrivers(false)} 
              style={{ 
                backgroundColor: !showDrivers ? "#007bff" : "white", 
                color: !showDrivers ? "white" : "#007bff", 
                border: "none", 
                padding: "8px 12px", 
                cursor: "pointer",
                borderRight: "1px solid #ccc"
              }}
            >
              Rides
            </button>
            <button 
              onClick={() => setShowDrivers(true)} 
              style={{ 
                backgroundColor: showDrivers ? "#007bff" : "white", 
                color: showDrivers ? "white" : "#007bff", 
                border: "none", 
                padding: "8px 12px", 
                cursor: "pointer"
              }}
            >
              Drivers
            </button>
          </div>
        </div>
      </div>
      {/* --- Table Styling Block: Grey Background & Status Column --- */}
      <div style={{ overflowX: "auto", maxWidth: "100vw", overflowY: "auto", maxHeight: "70vh", marginTop: "0" }}>
        {showDrivers ? (
          <table style={{ minWidth: "600px", width: "100%", borderCollapse: "collapse", marginTop: "1em", background: "#f4f4f4", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Name</th>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Phone</th>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Vehicle Number</th>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Vehicle Size</th>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Max Load</th>
                <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>License</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, idx) => (
                <tr key={driver.id} style={{ background: idx % 2 === 0 ? "#f4f4f4" : "#e0e0e0", borderBottom: "1px solid #4a90e2" }}>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>{driver.name}</td>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>{driver.phoneNumber}</td>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>{driver.vehicleNumber}</td>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>{driver.vehicleSize} Ft</td>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>{driver.maxLoad}</td>
                  <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span>{showLicense[driver.id] ? driver.licenseNumber : "••••••••"}</span>
                      <button 
                        onClick={() => setShowLicense(prev => ({...prev, [driver.id]: !prev[driver.id]}))}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}
                      >
                        {showLicense[driver.id] ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
        <table
          style={{
            minWidth: "900px",
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1em",
            background: "#f4f4f4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}
        >
          <thead>
            <tr>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("customId")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Custom ID {sortField === "customId" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("content")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Content {sortField === "content" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("userName")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  User Name {sortField === "userName" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("driverName")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Driver Name {sortField === "driverName" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("phoneNumber")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Phone Number {sortField === "phoneNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("truckSize")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Truck Size {sortField === "truckSize" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("status")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>

              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("updatedAt")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Updated At {sortField === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px",
                color: "#333",
                fontWeight: "bold"
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, idx) => (
              <tr
                key={todo.id}
                style={{
                  background: idx % 2 === 0 ? "#f4f4f4" : "#e0e0e0",
                  borderBottom: "1px solid #90ee90"
                }}
              >
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.customId || todo.id}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.content}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.userName}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.driverName}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.phoneNumber}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.truckSize}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>
                  <select 
                    value={todo.status || "In Progress"} 
                    onChange={(e) => {
                      client.models.Todo.update({
                        id: todo.id,
                        status: e.target.value
                      });
                    }}
                    style={{ 
                      border: "none", 
                      background: "transparent", 
                      width: "100%",
                      color: todo.status === "Completed" ? "#28a745" : 
                             todo.status === "Blocked" ? "#dc3545" :
                             todo.status === "Waiting" ? "#ffc107" :
                             todo.status === "Vehicle Repair" ? "#6f42c1" :
                             todo.status === "Pending Payment" ? "#fd7e14" : "#007bff",
                      fontWeight: "bold"
                    }}
                  >
                    <option value="In Progress" style={{ color: "#007bff" }}>In Progress</option>
                    <option value="Blocked" style={{ color: "#dc3545" }}>Blocked</option>
                    <option value="Waiting" style={{ color: "#ffc107" }}>Waiting</option>
                    <option value="Vehicle Repair" style={{ color: "#6f42c1" }}>Vehicle Repair</option>
                    <option value="Completed" style={{ color: "#28a745" }}>Completed</option>
                    <option value="Pending Payment" style={{ color: "#fd7e14" }}>Pending Payment</option>
                  </select>
                </td>

                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>
                  {todo.updatedAt && (
                    <span title={`Time: ${formatDateCell(todo.updatedAt).tooltip}`}>
                      {formatDateCell(todo.updatedAt).display}
                    </span>
                  )}
                </td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>
                  <button
                    onClick={() => updateTodo(todo.id)}
                    title="Edit"
                    style={{ marginRight: 4, fontSize: "0.9em", padding: "2px 6px" }}
                  >✏️</button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete"
                    style={{ fontSize: "0.9em", padding: "2px 6px" }}
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {/* --- End Table Styling Block --- */}
      
      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            maxWidth: "90vw"
          }}>
            <h3>Add New Todo</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Content:</label>
                <input
                  type="text"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>User Name:</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Driver Name:</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Truck Size:</label>
                <input
                  type="text"
                  value={formData.truckSize}
                  onChange={(e) => setFormData({...formData, truckSize: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Vehicle Repair">Vehicle Repair</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Payment">Pending Payment</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              handleEditCancel();
            }
          }}
          tabIndex={-1}
        >
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            maxWidth: "90vw"
          }}>
            <h3>Edit Todo</h3>
            
            {/* Changes Summary */}
            {Object.keys(editFormData).some(key => editFormData[key as keyof typeof editFormData] !== originalData[key as keyof typeof originalData]) && (
              <div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px", border: "1px solid #dee2e6" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#495057" }}>Changes:</h4>
                {Object.keys(editFormData).map(key => {
                  const typedKey = key as keyof typeof editFormData;
                  const oldValue = originalData[typedKey];
                  const newValue = editFormData[typedKey];
                  if (oldValue !== newValue) {
                    return (
                      <div key={key} style={{ marginBottom: "5px" }}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong>
                        <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ backgroundColor: "#ffebee", padding: "2px 6px", borderRadius: "3px", textDecoration: "line-through", fontSize: "12px" }}>
                            {oldValue}
                          </span>
                          <span>→</span>
                          <span style={{ backgroundColor: "#e8f5e8", padding: "2px 6px", borderRadius: "3px", fontSize: "12px" }}>
                            {newValue}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
            
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Content:</label>
                <input
                  type="text"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>User Name:</label>
                <input
                  type="text"
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({...editFormData, userName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Driver Name:</label>
                <input
                  type="text"
                  value={editFormData.driverName}
                  onChange={(e) => setEditFormData({...editFormData, driverName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Truck Size:</label>
                <input
                  type="text"
                  value={editFormData.truckSize}
                  onChange={(e) => setEditFormData({...editFormData, truckSize: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Status:</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Vehicle Repair">Vehicle Repair</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending Payment">Pending Payment</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setShowConfirmModal(false);
            }
          }}
          tabIndex={-1}
        >
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 20px 0" }}>You have unsaved changes. Exit without saving?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
              >
                No
              </button>
              <button
                onClick={confirmExit}
                style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingTodo && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setShowDeleteModal(false);
            }
          }}
          tabIndex={-1}
        >
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#dc3545" }}>Delete Record</h3>
            {(() => {
              const todo = todos.find(t => t.id === deletingTodo);
              return todo ? (
                <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "4px", textAlign: "left" }}>
                  <div><strong>ID:</strong> {todo.customId || todo.id}</div>
                  <div><strong>Content:</strong> {todo.content}</div>
                  <div><strong>User:</strong> {todo.userName}</div>
                  <div><strong>Driver:</strong> {todo.driverName}</div>
                  <div><strong>Phone:</strong> {todo.phoneNumber}</div>
                  <div><strong>Truck Size:</strong> {todo.truckSize}</div>
                  <div><strong>Status:</strong> {todo.status}</div>
                </div>
              ) : null;
            })()}
            <p style={{ margin: "0 0 20px 0" }}>Are you sure you want to delete this record?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Driver Modal */}
      {showDriverModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            maxWidth: "90vw"
          }}>
            <h3>Add New Driver</h3>
            <form onSubmit={handleDriverSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Name *:</label>
                <input
                  type="text"
                  value={driverFormData.name}
                  onChange={(e) => setDriverFormData({...driverFormData, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Phone Number *:</label>
                <input
                  type="text"
                  value={driverFormData.phoneNumber}
                  onChange={(e) => setDriverFormData({...driverFormData, phoneNumber: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  value={driverFormData.vehicleNumber}
                  onChange={(e) => setDriverFormData({...driverFormData, vehicleNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Size (Ft):</label>
                <input
                  type="text"
                  value={driverFormData.vehicleSize}
                  onChange={(e) => setDriverFormData({...driverFormData, vehicleSize: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Max Load:</label>
                <select
                  value={driverFormData.maxLoad}
                  onChange={(e) => setDriverFormData({...driverFormData, maxLoad: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  <option value="1 Ton">1 Ton</option>
                  <option value="5 Ton">5 Ton</option>
                  <option value="10 Ton">10 Ton</option>
                  <option value="15 Ton">15 Ton</option>
                  <option value="20 Ton">20 Ton</option>
                  <option value="25 Ton">25 Ton</option>
                  <option value="32 Ton">32 Ton</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Aadhar Number:</label>
                <input
                  type="text"
                  value={driverFormData.aadharNumber}
                  onChange={(e) => setDriverFormData({...driverFormData, aadharNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>License Number:</label>
                <input
                  type="text"
                  value={driverFormData.licenseNumber}
                  onChange={(e) => setDriverFormData({...driverFormData, licenseNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button 
        onClick={signOut}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4444",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Sign out
      </button>
    </main>
  );
}

export default App;
