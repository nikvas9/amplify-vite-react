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
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
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

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content === null) return;

    const userName = window.prompt("User Name");
    if (userName === null) return;

    const driverName = window.prompt("Driver Name");
    if (driverName === null) return;

    const phoneNumber = window.prompt("Phone Number");
    if (phoneNumber === null) return;

    const truckSize = window.prompt("Truck Size");
    if (truckSize === null) return;

    const status = window.prompt("Status (In Progress, Blocked, Waiting, Vehicle Repair, Completed, Pending Payment):") || "In Progress";

    client.models.Todo.create({
      content,
      userName,
      driverName,
      phoneNumber,
      truckSize,
      status,
    })
    .then((result) => {
      console.log("Todo created successfully:", result);
    })
    .catch((err) => {
      console.error("Create failed:", err);
      alert("Create failed: " + (err.message || err));
    });
  }

  function updateTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const content = window.prompt("Edit todo content", todo.content ?? "");
    if (content === null) return;

    const userName = window.prompt("Edit user name", todo.userName ?? "");
    if (userName === null) return;

    const driverName = window.prompt("Edit driver name", todo.driverName ?? "");
    if (driverName === null) return;

    const phoneNumber = window.prompt("Edit phone number", todo.phoneNumber ?? "");
    if (phoneNumber === null) return;

    const truckSize = window.prompt("Edit truck size", todo.truckSize ?? "");
    if (truckSize === null) return;

    const status = window.prompt("Edit status (In Progress, Blocked, Waiting, Vehicle Repair, Completed, Pending Payment):", todo.status ?? "In Progress");
    if (status === null) return;

    client.models.Todo.update({
      id,
      content,
      userName,
      driverName,
      phoneNumber,
      truckSize,
      status,
    })
    .then(() => {
      console.log("Todo updated!");
    })
    .catch((err) => {
      console.error("Update failed:", err);
      alert("Update failed: " + err.message);
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>
          My{user?.username ? ` (${user.username})` : ""} todos
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Filter todos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button onClick={createTodo}>+ new</button>
        </div>
      </div>
      {/* --- Table Styling Block: Grey Background & Status Column --- */}
      <div style={{ overflowX: "auto", maxWidth: "100vw", overflowY: "auto", maxHeight: "70vh", marginTop: "0" }}>
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
                <button onClick={() => handleSort("id")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
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
                <button onClick={() => handleSort("createdAt")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Created At {sortField === "createdAt" && (sortDirection === "asc" ? "↑" : "↓")}
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
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.id}</td>
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
                  {todo.createdAt && (
                    <span title={`Time: ${formatDateCell(todo.createdAt).tooltip}`}>
                      {formatDateCell(todo.createdAt).display}
                    </span>
                  )}
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
      </div>
      {/* --- End Table Styling Block --- */}
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
