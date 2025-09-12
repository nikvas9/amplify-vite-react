import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function formatDateCell(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const display = `${date.getFullYear()}-${date.toLocaleString("en-US", { month: "short" })}-${String(date.getDate()).padStart(2, "0")}`;
  const tooltip = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return { display, tooltip };
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

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

    client.models.Todo.create({
      content,
      userName,
      driverName,
      phoneNumber,
      truckSize,
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

    client.models.Todo.update({
      id,
      content,
      userName,
      driverName,
      phoneNumber,
      truckSize,
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
    <main>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>
          My{user?.username ? ` (${user.username})` : ""} todos
        </h1>
        <button onClick={createTodo} style={{ marginLeft: "auto" }}>+ new</button>
      </div>
      {/* --- Table Styling Block: Grey Background & Status Column --- */}
      <div style={{ overflowX: "auto", maxWidth: "100vw", overflowY: "auto", maxHeight: "70vh" }}>
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
              }}>ID</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Content</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>User Name</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Driver Name</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Phone Number</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Truck Size</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Status</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Created At</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Updated At</th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, idx) => (
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
                  {todo.status ?? ""}
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
                <td style={{ padding: "8px" }}>
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
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
