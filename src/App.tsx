import { useEffect, useState, useRef } from "react";
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

function formatIndianCurrency(amount: number | null | undefined): string {
  if (!amount || amount === null) return "₹    0";
  return "₹    " + amount.toLocaleString("en-IN");
}

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [filteredTodos, setFilteredTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [drivers, setDrivers] = useState<Array<Schema["Driver"]["type"]>>([]);
  const [budgets, setBudgets] = useState<Array<Schema["Budget"]["type"]>>([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
  const [showLicense, setShowLicense] = useState<{[key: string]: boolean}>({});
  const [deletingTodo, setDeletingTodo] = useState<string | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editingDriver, setEditingDriver] = useState<string | null>(null);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [editDriverFormData, setEditDriverFormData] = useState({
    name: "",
    phoneNumber: "",
    vehicleNumber: "",
    vehicleSize: "",
    maxLoad: "1 Ton",
    aadharNumber: "",
    licenseNumber: ""
  });
  const [formData, setFormData] = useState({
    customerName: "",
    expense: "",
    status: "",
    fromLocation: "",
    toLocation: "",
    notes: "",
    driverName: "",
    vehicleNumber: "",
    startDate: new Date().toISOString().split('T')[0]
  });
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [filteredDrivers, setFilteredDrivers] = useState<Array<Schema["Driver"]["type"]>>([]);
  const [showEditDriverDropdown, setShowEditDriverDropdown] = useState(false);
  const [filteredEditDrivers, setFilteredEditDrivers] = useState<Array<Schema["Driver"]["type"]>>([]);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    expense: "",
    status: "In Progress",
    fromLocation: "",
    toLocation: "",
    notes: "",
    driverName: "",
    vehicleNumber: "",
    startDate: ""
  });
  const [originalData, setOriginalData] = useState({
    customerName: "",
    expense: "",
    status: "In Progress",
    fromLocation: "",
    toLocation: "",
    notes: "",
    driverName: "",
    vehicleNumber: "",
    startDate: ""
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
  const [showSummary, setShowSummary] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetFormData, setBudgetFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    budget: ""
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [lastBotResponse, setLastBotResponse] = useState<string>("");
  const [lastContext, setLastContext] = useState<{type: string, count: number}>({type: "", count: 0});
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => {
        const userTodos = data.items.filter(item => item.partner === user?.signInDetails?.loginId && ((item as any).isActive !== false));
        setTodos([...userTodos]);
      },
    });
    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    const subscription = client.models.Driver.observeQuery().subscribe({
      next: (data) => {
        const userDrivers = data.items.filter(item => item.partner === user?.signInDetails?.loginId && ((item as any).isActive !== false));
        setDrivers([...userDrivers]);
      },
    });
    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    const subscription = client.models.Budget.observeQuery().subscribe({
      next: (data) => {
        const userBudgets = data.items.filter(item => item.partner === user?.signInDetails?.loginId);
        setBudgets([...userBudgets]);
      },
    });
    return () => subscription.unsubscribe();
  }, [user]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    let filtered = todos.filter(todo => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return (
        (todo.customerName || "").toLowerCase().includes(searchTerm) ||
        (todo.driverName || "").toLowerCase().includes(searchTerm) ||
        (todo.vehicleNumber || "").includes(filter) ||
        (todo.fromLocation || "").toLowerCase().includes(searchTerm) ||
        (todo.toLocation || "").toLowerCase().includes(searchTerm) ||
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

  function handleDriverChange(driverName: string) {
    const selectedDriver = drivers.find(d => d.name === driverName);
    setFormData(prev => ({
      ...prev,
      driverName,
      vehicleNumber: selectedDriver?.vehicleNumber || ""
    }));
    setShowDriverDropdown(false);
  }

  function handleDriverInputChange(value: string) {
    setFormData(prev => ({ ...prev, driverName: value }));
    const filtered = drivers.filter(driver => 
      driver.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
    setShowDriverDropdown(value.length > 0 && filtered.length > 0);
  }

  function handleEditDriverInputChange(value: string) {
    setEditFormData(prev => ({ ...prev, driverName: value }));
    const filtered = drivers.filter(driver => 
      driver.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEditDrivers(filtered);
    setShowEditDriverDropdown(value.length > 0 && filtered.length > 0);
  }

  function handleEditDriverChange(driverName: string) {
    const selectedDriver = drivers.find(d => d.name === driverName);
    setEditFormData(prev => ({
      ...prev,
      driverName,
      vehicleNumber: selectedDriver?.vehicleNumber || ""
    }));
    setShowEditDriverDropdown(false);
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
      partner: user?.signInDetails?.loginId || ""
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
      setNotification("Driver added successfully!");
      setTimeout(() => setNotification(null), 3000);
    })
    .catch((err) => alert("Failed to create driver: " + err.message));
  }

  function editDriver(id: string) {
    const driver = drivers.find(d => d.id === id);
    if (!driver) return;
    
    setEditDriverFormData({
      name: driver.name || "",
      phoneNumber: driver.phoneNumber || "",
      vehicleNumber: driver.vehicleNumber || "",
      vehicleSize: driver.vehicleSize || "",
      maxLoad: driver.maxLoad || "1 Ton",
      aadharNumber: driver.aadharNumber || "",
      licenseNumber: driver.licenseNumber || ""
    });
    setEditingDriver(id);
    setShowEditDriverModal(true);
  }

  function handleEditDriverSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDriver) return;

    client.models.Driver.update({
      id: editingDriver,
      name: editDriverFormData.name,
      phoneNumber: editDriverFormData.phoneNumber,
      vehicleNumber: editDriverFormData.vehicleNumber,
      vehicleSize: editDriverFormData.vehicleSize,
      maxLoad: editDriverFormData.maxLoad,
      aadharNumber: editDriverFormData.aadharNumber,
      licenseNumber: editDriverFormData.licenseNumber
    })
    .then(() => {
      setShowEditDriverModal(false);
      setEditingDriver(null);
      setNotification("Driver updated successfully!");
      setTimeout(() => setNotification(null), 3000);
    })
    .catch((err) => alert("Update failed: " + err.message));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    console.log("Form data:", formData);
    
    const selectedDriver = drivers.find(d => d.name === formData.driverName);
    const customId = generateCustomId();

    const todoData = {
      customId,
      customerName: formData.customerName,
      expense: parseFloat(formData.expense) || 0,
      status: formData.status,
      partner: user?.signInDetails?.loginId || "",
      fromLocation: formData.fromLocation,
      toLocation: formData.toLocation,
      notes: formData.notes,
      driverName: formData.driverName,
      vehicleNumber: formData.vehicleNumber,
      vehicleSize: selectedDriver?.vehicleSize || "",
      maxLoad: selectedDriver?.maxLoad || "",
      startDate: formData.startDate
    };

    console.log("Todo data to create:", todoData);

    client.models.Todo.create(todoData)
    .then((result) => {
      console.log("Create success:", result);
      console.log("Setting notification...");
      setShowModal(false);
      setFormData({
        customerName: "",
        expense: "",
        status: "",
        fromLocation: "",
        toLocation: "",
        notes: "",
        driverName: "",
        vehicleNumber: "",
        startDate: new Date().toISOString().split('T')[0]
      });
      setNotification("Ride added successfully!");
      setTimeout(() => {
        console.log("Clearing notification...");
        setNotification(null);
      }, 3000);
    })
    .catch((err) => {
      console.error("Create error:", err);
      alert("Create failed: " + err.message);
    });
  }

  function updateTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const todoData = {
      customerName: todo.customerName || "",
      expense: todo.expense?.toString() || "",
      status: todo.status || "In Progress",
      fromLocation: todo.fromLocation || "",
      toLocation: todo.toLocation || "",
      notes: todo.notes || "",
      driverName: todo.driverName || "",
      vehicleNumber: todo.vehicleNumber || "",
      startDate: todo.startDate || ""
    };
    
    setEditFormData(todoData);
    setOriginalData(todoData);
    setEditingTodo(id);
    setShowEditModal(true);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTodo) return;

    const selectedDriver = drivers.find(d => d.name === editFormData.driverName);
    const currentTodo = todos.find(t => t.id === editingTodo);
    const customId = currentTodo?.customId || editingTodo;

    client.models.Todo.update({
      id: editingTodo,
      customerName: editFormData.customerName,
      expense: parseFloat(editFormData.expense) || 0,
      status: editFormData.status,
      fromLocation: editFormData.fromLocation,
      toLocation: editFormData.toLocation,
      notes: editFormData.notes,
      driverName: editFormData.driverName,
      vehicleNumber: editFormData.vehicleNumber,
      vehicleSize: selectedDriver?.vehicleSize || "",
      maxLoad: selectedDriver?.maxLoad || "",
      startDate: editFormData.startDate
    })
    .then(() => {
      console.log("Todo updated!");
      setShowEditModal(false);
      setEditingTodo(null);
      setNotification(`Ride ${customId} updated successfully!`);
      setTimeout(() => setNotification(null), 3000);
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

  function deleteDriver(id: string) {
    setDeletingDriver(id);
    setShowDeleteDriverModal(true);
  }

  function confirmDriverDelete() {
    if (deletingDriver) {
      const driverToDelete = drivers.find(d => d.id === deletingDriver);
      const driverName = driverToDelete?.name || deletingDriver;
      
      // Try to update with isActive field, fallback to hard delete if it fails
      client.models.Driver.update({
        id: deletingDriver,
        isActive: false
      } as any)
      .then(() => {
        setShowDeleteDriverModal(false);
        setDeletingDriver(null);
        setNotification(`Driver ${driverName} deleted successfully!`);
        setTimeout(() => setNotification(null), 3000);
      })
      .catch((updateErr) => {
        console.warn("Soft delete failed, trying hard delete:", updateErr);
        // Fallback to hard delete for records without isActive field
        client.models.Driver.delete({ id: deletingDriver })
        .then(() => {
          setShowDeleteDriverModal(false);
          setDeletingDriver(null);
          setNotification(`Driver ${driverName} deleted successfully!`);
          setTimeout(() => setNotification(null), 3000);
        })
        .catch((deleteErr) => {
          console.error("Delete failed:", deleteErr);
          alert("Delete failed: " + deleteErr.message);
        });
      });
    }
  }

  function confirmDelete() {
    if (deletingTodo) {
      const todoToDelete = todos.find(t => t.id === deletingTodo);
      const customId = todoToDelete?.customId || deletingTodo;
      
      // Try to update with isActive field, fallback to hard delete if it fails
      client.models.Todo.update({
        id: deletingTodo,
        isActive: false
      } as any)
      .then(() => {
        setShowDeleteModal(false);
        setDeletingTodo(null);
        setNotification(`Ride ${customId} deleted successfully!`);
        setTimeout(() => setNotification(null), 3000);
      })
      .catch((updateErr) => {
        console.warn("Soft delete failed, trying hard delete:", updateErr);
        // Fallback to hard delete for records without isActive field
        client.models.Todo.delete({ id: deletingTodo })
        .then(() => {
          setShowDeleteModal(false);
          setDeletingTodo(null);
          setNotification(`Ride ${customId} deleted successfully!`);
          setTimeout(() => setNotification(null), 3000);
        })
        .catch((deleteErr) => {
          console.error("Delete failed:", deleteErr);
          alert("Delete failed: " + deleteErr.message);
        });
      });
    }
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, {type: 'user', message: userMessage}]);
    
    let botResponse = "I'm not sure about that. Try asking about budget, rides, drivers, expenses, vehicles, or revenue.";
    const query = userMessage.toLowerCase()
      .replace(/trips/g, 'rides')
      .replace(/trip/g, 'ride')
      .replace(/vehicles?/g, 'vehicle')
      .replace(/cars?/g, 'vehicle')
      .replace(/trucks?/g, 'vehicle')
      .replace(/engaged/g, 'working')
      .replace(/involved/g, 'working');
    
    // Handle previous question references and context
    if ((query.includes('previous') || query.includes('last') || query.includes('that') || query.includes('those')) && !query.includes('expense')) {
      if (lastBotResponse) {
        botResponse = `My previous answer was: ${lastBotResponse}`;
      } else {
        botResponse = "I don't have a previous answer to refer to.";
      }
    }
    // Handle expense questions about previous context (those/that rides)
    else if ((query.includes('those') || query.includes('that') || query.includes('three')) && (query.includes('expense') || query.includes('total') || query.includes('cost'))) {
      if (lastContext.type === 'completed') {
        const completedRides = filteredTodos.filter(t => t.status === "Completed");
        const totalExpenses = completedRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
        botResponse = `Total expenses for those ${completedRides.length} completed rides: ${formatIndianCurrency(totalExpenses)}`;
      } else if (lastContext.type === 'progress') {
        const inProgressRides = filteredTodos.filter(t => t.status === "In Progress");
        const totalExpenses = inProgressRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
        botResponse = `Total expenses for those ${inProgressRides.length} rides in progress: ${formatIndianCurrency(totalExpenses)}`;
      } else if (lastContext.type === 'blocked') {
        const blockedRides = filteredTodos.filter(t => t.status === "Blocked");
        const totalExpenses = blockedRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
        botResponse = `Total expenses for those ${blockedRides.length} blocked rides: ${formatIndianCurrency(totalExpenses)}`;
      } else {
        botResponse = "I need more context. Please ask about specific rides first (completed, in progress, or blocked).";
      }
    }
    // Cross-data queries (combining drivers, rides, budget)
    else if ((query.includes('driver') || query.includes('drivers')) && (query.includes('working') || query.includes('rides'))) {
      const engagedDrivers = new Set(filteredTodos.map(todo => todo.driverName).filter(name => name));
      const driverNames = Array.from(engagedDrivers).join(', ');
      botResponse = `${engagedDrivers.size} drivers are engaged in rides: ${driverNames || 'None'}`;
    }
    else if (query.includes('revenue') || query.includes('total revenue')) {
      const completedRides = filteredTodos.filter(t => t.status === "Completed");
      const totalRevenue = completedRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      botResponse = `Total revenue from ${completedRides.length} completed rides: ${formatIndianCurrency(totalRevenue)}`;
    }
    else if (query.includes('profit') || query.includes('net profit')) {
      const now = new Date();
      const monthlyBudget = budgets.find(b => b.month === now.getMonth() + 1 && b.year === now.getFullYear());
      const totalBudget = monthlyBudget?.budget || 0;
      const completedRides = filteredTodos.filter(t => t.status === "Completed");
      const totalRevenue = completedRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      const profit = totalRevenue - totalBudget;
      botResponse = `Revenue: ${formatIndianCurrency(totalRevenue)}, Budget: ${formatIndianCurrency(totalBudget)}, Net Profit: ${formatIndianCurrency(profit)}`;
    }
    // Budget queries
    else if (query.includes('budget')) {
      const now = new Date();
      const monthlyBudget = budgets.find(b => b.month === now.getMonth() + 1 && b.year === now.getFullYear());
      const totalBudget = monthlyBudget?.budget || 0;
      const totalSpent = filteredTodos.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      botResponse = `Current budget: ${formatIndianCurrency(totalBudget)}, Spent: ${formatIndianCurrency(totalSpent)}, Balance: ${formatIndianCurrency(totalBudget - totalSpent)}`;
    }
    // Expense queries
    else if (query.includes('expense') || query.includes('cost') || query.includes('total') && (query.includes('completed') || query.includes('done'))) {
      const completedRides = filteredTodos.filter(t => t.status === "Completed");
      const totalExpenses = completedRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      botResponse = `Total expenses for ${completedRides.length} completed rides: ${formatIndianCurrency(totalExpenses)}`;
    }
    else if (query.includes('expense') && query.includes('progress')) {
      const inProgressRides = filteredTodos.filter(t => t.status === "In Progress");
      const totalExpenses = inProgressRides.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      botResponse = `Total expenses for ${inProgressRides.length} rides in progress: ${formatIndianCurrency(totalExpenses)}`;
    }
    else if (query.includes('total expense') || query.includes('all expense')) {
      const totalExpenses = filteredTodos.reduce((sum, todo) => sum + (todo.expense || 0), 0);
      botResponse = `Total expenses for all ${filteredTodos.length} rides: ${formatIndianCurrency(totalExpenses)}`;
    }
    // Ride status queries with context tracking
    else if (query.includes('rides') && query.includes('progress')) {
      const inProgress = filteredTodos.filter(t => t.status === "In Progress").length;
      botResponse = `There are ${inProgress} rides currently in progress.`;
      setLastContext({type: 'progress', count: inProgress});
    }
    else if (query.includes('rides') && query.includes('completed')) {
      const completed = filteredTodos.filter(t => t.status === "Completed").length;
      botResponse = `${completed} rides have been completed.`;
      setLastContext({type: 'completed', count: completed});
    }
    else if (query.includes('rides') && query.includes('blocked')) {
      const blocked = filteredTodos.filter(t => t.status === "Blocked").length;
      botResponse = `${blocked} rides are currently blocked.`;
      setLastContext({type: 'blocked', count: blocked});
    }
    // Vehicle queries
    else if (query.includes('how many vehicle')) {
      const uniqueVehicles = new Set(drivers.map(d => d.vehicleNumber).filter(v => v));
      botResponse = `There are ${uniqueVehicles.size} unique vehicles.`;
    }
    else if (query.includes('unique') && query.includes('max load')) {
      const uniqueMaxLoads = new Set(drivers.map(d => d.maxLoad).filter(m => m));
      const loads = Array.from(uniqueMaxLoads).join(', ');
      botResponse = `There are ${uniqueMaxLoads.size} unique max loads: ${loads}`;
    }
    else if (query.includes('vehicle') && query.includes('1 ton')) {
      const oneTonVehicles = drivers.filter(d => d.maxLoad === '1 Ton' && d.vehicleNumber);
      const vehicleNumbers = oneTonVehicles.map(d => d.vehicleNumber).join(', ');
      botResponse = `There are ${oneTonVehicles.length} vehicles with 1 Ton max load: ${vehicleNumbers || 'None'}`;
    }
    else if (query.includes('vehicle') && query.includes('5 ton')) {
      const fiveTonVehicles = drivers.filter(d => d.maxLoad === '5 Ton' && d.vehicleNumber);
      const vehicleNumbers = fiveTonVehicles.map(d => d.vehicleNumber).join(', ');
      botResponse = `There are ${fiveTonVehicles.length} vehicles with 5 Ton max load: ${vehicleNumbers || 'None'}`;
    }
    else if (query.includes('vehicle') && query.includes('10 ton')) {
      const tenTonVehicles = drivers.filter(d => d.maxLoad === '10 Ton' && d.vehicleNumber);
      const vehicleNumbers = tenTonVehicles.map(d => d.vehicleNumber).join(', ');
      botResponse = `There are ${tenTonVehicles.length} vehicles with 10 Ton max load: ${vehicleNumbers || 'None'}`;
    }
    // Driver queries
    else if (query.includes('drivers')) {
      const activeDrivers = drivers.filter(d => (d as any).isActive !== false).length;
      botResponse = `There are ${drivers.length} total drivers, ${activeDrivers} are active.`;
    }
    // Total rides
    else if (query.includes('total rides')) {
      botResponse = `Total rides: ${filteredTodos.length}`;
    }
    
    setLastBotResponse(botResponse);
    setChatMessages(prev => [...prev, {type: 'bot', message: botResponse}]);
    setChatInput("");
  }

  function exportToCSV() {
    const headers = ['Custom ID', 'Customer', 'Expense', 'From', 'To', 'Driver Name', 'Vehicle Number', 'Status', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...filteredTodos.map(todo => [
        `"${todo.customId || todo.id || ''}"`,
        `"${(todo.customerName || '').replace(/"/g, '""')}"`,
        `"${todo.expense || ''}"`,
        `"${(todo.fromLocation || '').replace(/"/g, '""')}"`,
        `"${(todo.toLocation || '').replace(/"/g, '""')}"`,
        `"${(todo.driverName || '').replace(/"/g, '""')}"`,
        `"${(todo.vehicleNumber || '').replace(/"/g, '""')}"`,
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

  function downloadDriverTemplate() {
    const headers = ['Name', 'Phone Number', 'Vehicle Number', 'Vehicle Size', 'Max Load', 'Aadhar Number', 'License Number'];
    const sampleData = ['John Doe', '9876543210', 'KA01AB1234', '14', '5 Ton', '123456789012', 'DL1234567890'];
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivers_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleDriverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 7 && values[0].trim()) {
          client.models.Driver.create({
            name: values[0].trim(),
            phoneNumber: values[1].trim(),
            vehicleNumber: values[2].trim(),
            vehicleSize: values[3].trim(),
            maxLoad: values[4].trim(),
            aadharNumber: values[5].trim(),
            licenseNumber: values[6].trim(),
            partner: user?.signInDetails?.loginId || ""
          });
        }
      }
      setNotification("Drivers uploaded successfully!");
      setTimeout(() => setNotification(null), 3000);
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  return (
    <main style={{ display: "flex", flexDirection: "row", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      {/* Toggle Button - Fixed Position */}
      <button 
        onClick={() => setShowSummary(!showSummary)}
        style={{ 
          position: "fixed",
          top: "20px",
          left: "20px",
          backgroundColor: "#6c757d", 
          color: "white", 
          border: "none", 
          padding: "8px 12px", 
          borderRadius: "4px", 
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        {showSummary ? "◀" : "▶"}
      </button>
      
      {/* Sidebar - Summary */}
      <div style={{ 
        position: "fixed",
        left: 0,
        top: 0,
        width: showSummary ? `${sidebarWidth}px` : "0px", 
        minWidth: showSummary ? "250px" : "0px",
        maxWidth: showSummary ? "600px" : "0px",
        backgroundColor: "#f8f9fa", 
        borderRight: showSummary ? "2px solid #dee2e6" : "none", 
        padding: showSummary ? "20px 20px 20px 10px" : "0",
        paddingTop: showSummary ? "70px" : "0",
        overflowY: showSummary ? "auto" : "hidden",
        overflowX: "hidden",
        height: "100vh",
        transition: showSummary ? "none" : "all 0.3s ease",
        visibility: showSummary ? "visible" : "hidden",
        zIndex: 999
      }}>
        <h2 style={{ margin: "0 0 15px 10px", color: "#495057", fontSize: "18px", textAlign: "left" }}>Summary</h2>
        
        {/* Budget Summary */}
        {(() => {
          const now = new Date();
          const currentMonth = now.getMonth() + 1;
          const currentYear = now.getFullYear();
          const monthlyBudget = budgets.find(b => b.month === currentMonth && b.year === currentYear);
          const totalBudget = monthlyBudget?.budget || 0;
          const totalSpent = filteredTodos.reduce((sum, todo) => sum + (todo.expense || 0), 0);
          const balance = totalBudget - totalSpent;
          
          return (
            <div style={{ marginBottom: "15px", marginLeft: "10px", padding: "12px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #dee2e6" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#6f42c1", fontSize: "16px" }}>Budget</h4>
              <div style={{ fontSize: "12px", lineHeight: "1.4", wordWrap: "break-word", whiteSpace: "normal" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Budget: {formatIndianCurrency(totalBudget)}</span>
                  <button 
                    onClick={() => {
                      setBudgetFormData({
                        month: currentMonth,
                        year: currentYear,
                        budget: monthlyBudget?.budget?.toString() || ""
                      });
                      setShowBudgetModal(true);
                    }}
                    style={{ 
                      backgroundColor: "#6f42c1", 
                      color: "white", 
                      border: "none", 
                      padding: "2px 6px", 
                      borderRadius: "3px", 
                      cursor: "pointer",
                      fontSize: "10px"
                    }}
                  >
                    ✏️
                  </button>
                </div>
                <div>Spent: {formatIndianCurrency(totalSpent)}</div>
                <div style={{ color: balance >= 0 ? "#28a745" : "#dc3545", fontWeight: "bold" }}>
                  Balance: {formatIndianCurrency(balance)}
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Rides Summary */}
        <div style={{ marginBottom: "15px", marginLeft: "10px", padding: "12px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #dee2e6" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#28a745", fontSize: "16px" }}>Rides</h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4", wordWrap: "break-word", whiteSpace: "normal" }}>
            <div>Total: {filteredTodos.length}</div>
            <div>Done: {filteredTodos.filter(t => t.status === "Completed").length}</div>
            <div>Active: {filteredTodos.filter(t => t.status === "In Progress").length}</div>
          </div>
        </div>
        
        {/* Drivers Summary */}
        <div style={{ marginBottom: "15px", marginLeft: "10px", padding: "12px", backgroundColor: "white", borderRadius: "6px", border: "1px solid #dee2e6" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#17a2b8", fontSize: "16px" }}>Drivers</h4>
          <div style={{ fontSize: "12px", lineHeight: "1.4", wordWrap: "break-word", whiteSpace: "normal" }}>
            <div>Total: {drivers.length}</div>
            <div>Active: {drivers.filter(d => (d as any).isActive !== false).length}</div>
          </div>
        </div>
        
        {/* Export Section */}
        <button 
          onClick={exportToCSV} 
          style={{ 
            width: "calc(100% - 10px)",
            marginLeft: "10px",
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            padding: "8px", 
            borderRadius: "4px", 
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          ⬇️ Export CSV
        </button>
        
        {/* Resize Handle */}
        {showSummary && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "4px",
              height: "100%",
              backgroundColor: "#dee2e6",
              cursor: "col-resize",
              zIndex: 1000
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = sidebarWidth;
              
              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = startWidth + (e.clientX - startX);
                if (newWidth >= 250 && newWidth <= 600) {
                  setSidebarWidth(newWidth);
                }
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        )}
      </div>
      
      {/* Main Content */}
      <div style={{ 
        width: "100%",
        marginLeft: showSummary ? `${sidebarWidth}px` : "0px",
        padding: "20px", 
        paddingLeft: showSummary ? "20px" : "70px",
        overflowY: "auto", 
        overflowX: "auto",
        height: "100vh",
        transition: showSummary ? "none" : "all 0.3s ease",
        minWidth: "600px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1 style={{ margin: 0 }}>
            {user?.signInDetails?.loginId || 'User'}'s list of rides
          </h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Filter Rides..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <button onClick={createTodo} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>+ Add Ride</button>
            <button onClick={createDriver} style={{ backgroundColor: "#17a2b8", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>+ Add Driver</button>
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
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 120px)" }}>
        {showDrivers ? (
          <>
            <table style={{ minWidth: "600px", width: "100%", borderCollapse: "collapse", marginTop: "1em", background: "#f4f4f4", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Name</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Phone</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Vehicle Number</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Vehicle Size</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Max Load</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>License</th>
                  <th style={{ borderBottom: "2px solid #4a90e2", borderRight: "1px solid #4a90e2", textAlign: "left", padding: "8px", color: "#333", fontWeight: "bold" }}>Actions</th>
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
                    <td style={{ borderRight: "1px solid #4a90e2", padding: "8px" }}>
                      <button
                        onClick={() => editDriver(driver.id)}
                        title="Edit"
                        style={{ marginRight: 4, fontSize: "0.9em", padding: "2px 6px" }}
                      >✏️</button>
                      <button
                        onClick={() => deleteDriver(driver.id)}
                        title="Delete"
                        style={{ fontSize: "0.9em", padding: "2px 6px" }}
                      >🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button 
                onClick={downloadDriverTemplate}
                style={{ 
                  backgroundColor: "#6c757d", 
                  color: "white", 
                  border: "none", 
                  padding: "8px 12px", 
                  borderRadius: "4px", 
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                📥 Download Template
              </button>
              <label style={{ 
                backgroundColor: "#17a2b8", 
                color: "white", 
                border: "none", 
                padding: "8px 12px", 
                borderRadius: "4px", 
                cursor: "pointer",
                fontSize: "12px"
              }}>
                📤 Upload CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleDriverUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </>
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
                <button onClick={() => handleSort("customerName")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Customer {sortField === "customerName" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("expense")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Expense {sortField === "expense" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("fromLocation")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  From {sortField === "fromLocation" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("toLocation")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  To {sortField === "toLocation" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("driverName")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Driver {sortField === "driverName" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th style={{
                borderBottom: "2px solid #90ee90",
                borderRight: "1px solid #90ee90",
                textAlign: "left",
                padding: "8px"
              }}>
                <button onClick={() => handleSort("vehicleNumber")} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontWeight: "bold" }}>
                  Vehicle {sortField === "vehicleNumber" && (sortDirection === "asc" ? "↑" : "↓")}
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
                  Updated {sortField === "updatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
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
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.customerName}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{formatIndianCurrency(todo.expense)}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.fromLocation}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.toLocation}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.driverName}</td>
                <td style={{ borderRight: "1px solid #90ee90", padding: "8px" }}>{todo.vehicleNumber}</td>
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
                             todo.status === "Vehicle Repair" ? "#6f42c1" :
                             todo.status === "Pending Payment" ? "#fd7e14" : "#007bff",
                      fontWeight: "bold"
                    }}
                  >
                    <option value="In Progress" style={{ color: "#007bff" }}>In Progress</option>
                    <option value="Blocked" style={{ color: "#dc3545" }}>Blocked</option>
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
      </div>
      
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
            <h3>Add New Ride</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Customer *:</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Expense *:</label>
                <input
                  type="number"
                  value={formData.expense}
                  onChange={(e) => setFormData({...formData, expense: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>From Location:</label>
                <input
                  type="text"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({...formData, fromLocation: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>To Location:</label>
                <input
                  type="text"
                  value={formData.toLocation}
                  onChange={(e) => setFormData({...formData, toLocation: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Notes:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px", minHeight: "60px" }}
                />
              </div>
              <div style={{ marginBottom: "10px", position: "relative" }}>
                <label>Driver Name:</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => handleDriverInputChange(e.target.value)}
                  onFocus={() => {
                    if (formData.driverName) {
                      const filtered = drivers.filter(driver => 
                        driver.name?.toLowerCase().includes(formData.driverName.toLowerCase())
                      );
                      setFilteredDrivers(filtered);
                      setShowDriverDropdown(filtered.length > 0);
                    }
                  }}
                  placeholder="Type to search drivers..."
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
                {showDriverDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderTop: "none",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}>
                    {filteredDrivers.map(driver => (
                      <div
                        key={driver.id}
                        onClick={() => handleDriverChange(driver.name || "")}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      >
                        {driver.name} - {driver.vehicleNumber}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                  readOnly
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Status *:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  <option value="">Select Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Blocked">Blocked</option>
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
            <h3>Edit Ride</h3>
            
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
                <label>Customer *:</label>
                <input
                  type="text"
                  value={editFormData.customerName}
                  onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Expense *:</label>
                <input
                  type="number"
                  value={editFormData.expense}
                  onChange={(e) => setEditFormData({...editFormData, expense: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>From Location:</label>
                <input
                  type="text"
                  value={editFormData.fromLocation}
                  onChange={(e) => setEditFormData({...editFormData, fromLocation: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>To Location:</label>
                <input
                  type="text"
                  value={editFormData.toLocation}
                  onChange={(e) => setEditFormData({...editFormData, toLocation: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Notes:</label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px", minHeight: "60px" }}
                />
              </div>
              <div style={{ marginBottom: "10px", position: "relative" }}>
                <label>Driver Name:</label>
                <input
                  type="text"
                  value={editFormData.driverName}
                  onChange={(e) => handleEditDriverInputChange(e.target.value)}
                  onFocus={() => {
                    if (editFormData.driverName) {
                      const filtered = drivers.filter(driver => 
                        driver.name?.toLowerCase().includes(editFormData.driverName.toLowerCase())
                      );
                      setFilteredEditDrivers(filtered);
                      setShowEditDriverDropdown(filtered.length > 0);
                    }
                  }}
                  placeholder="Type to search drivers..."
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
                {showEditDriverDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderTop: "none",
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000
                  }}>
                    {filteredEditDrivers.map(driver => (
                      <div
                        key={driver.id}
                        onClick={() => handleEditDriverChange(driver.name || "")}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      >
                        {driver.name} - {driver.vehicleNumber}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  value={editFormData.vehicleNumber}
                  onChange={(e) => setEditFormData({...editFormData, vehicleNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                  readOnly
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={editFormData.startDate}
                  onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
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
                  <div><strong>Customer:</strong> {todo.customerName}</div>
                  <div><strong>Expense:</strong> {formatIndianCurrency(todo.expense)}</div>
                  <div><strong>From:</strong> {todo.fromLocation}</div>
                  <div><strong>To:</strong> {todo.toLocation}</div>
                  <div><strong>Driver:</strong> {todo.driverName}</div>
                  <div><strong>Vehicle:</strong> {todo.vehicleNumber}</div>
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
      
      {/* Delete Driver Confirmation Modal */}
      {showDeleteDriverModal && deletingDriver && (
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
              setShowDeleteDriverModal(false);
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
            <h3 style={{ margin: "0 0 15px 0", color: "#dc3545" }}>Delete Driver</h3>
            {(() => {
              const driver = drivers.find(d => d.id === deletingDriver);
              return driver ? (
                <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "4px", textAlign: "left" }}>
                  <div><strong>Name:</strong> {driver.name}</div>
                  <div><strong>Phone:</strong> {driver.phoneNumber}</div>
                  <div><strong>Vehicle Number:</strong> {driver.vehicleNumber}</div>
                  <div><strong>Vehicle Size:</strong> {driver.vehicleSize} Ft</div>
                  <div><strong>Max Load:</strong> {driver.maxLoad}</div>
                  <div><strong>License:</strong> {driver.licenseNumber}</div>
                </div>
              ) : null;
            })()}
            <p style={{ margin: "0 0 20px 0" }}>Are you sure you want to delete this driver?</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteDriverModal(false)}
                style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
              >
                No
              </button>
              <button
                onClick={confirmDriverDelete}
                style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Budget Modal */}
      {showBudgetModal && (
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
            width: "300px",
            maxWidth: "90vw"
          }}>
            <h3>Set Budget</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const existingBudget = budgets.find(b => b.month === budgetFormData.month && b.year === budgetFormData.year);
              const budgetValue = parseFloat(budgetFormData.budget) || 0;
              
              if (existingBudget) {
                client.models.Budget.update({
                  id: existingBudget.id,
                  budget: budgetValue
                });
              } else {
                client.models.Budget.create({
                  partner: user?.signInDetails?.loginId || "",
                  month: budgetFormData.month,
                  year: budgetFormData.year,
                  budget: budgetValue
                });
              }
              
              setShowBudgetModal(false);
              setBudgetFormData({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                budget: ""
              });
            }}>
              <div style={{ marginBottom: "10px" }}>
                <label>Month *:</label>
                <select
                  value={budgetFormData.month}
                  onChange={(e) => setBudgetFormData({...budgetFormData, month: parseInt(e.target.value)})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Year *:</label>
                <select
                  value={budgetFormData.year}
                  onChange={(e) => setBudgetFormData({...budgetFormData, year: parseInt(e.target.value)})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  {[2024, 2025, 2026, 2027, 2028].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Budget:</label>
                <input
                  type="number"
                  value={budgetFormData.budget}
                  onChange={(e) => setBudgetFormData({...budgetFormData, budget: e.target.value})}
                  placeholder="0"
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", backgroundColor: "#6f42c1", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Driver Modal */}
      {showEditDriverModal && (
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
            <h3>Edit Driver</h3>
            <form onSubmit={handleEditDriverSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Name *:</label>
                <input
                  type="text"
                  value={editDriverFormData.name}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, name: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Phone Number *:</label>
                <input
                  type="text"
                  value={editDriverFormData.phoneNumber}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, phoneNumber: e.target.value})}
                  required
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  value={editDriverFormData.vehicleNumber}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, vehicleNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Size (Ft):</label>
                <input
                  type="text"
                  value={editDriverFormData.vehicleSize}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, vehicleSize: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Max Load:</label>
                <select
                  value={editDriverFormData.maxLoad}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, maxLoad: e.target.value})}
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
                  value={editDriverFormData.aadharNumber}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, aadharNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>License Number:</label>
                <input
                  type="text"
                  value={editDriverFormData.licenseNumber}
                  onChange={(e) => setEditDriverFormData({...editDriverFormData, licenseNumber: e.target.value})}
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowEditDriverModal(false)}
                  style={{ padding: "8px 16px", backgroundColor: "#ccc", border: "none", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "4px" }}
                >
                  Update
                </button>
              </div>
            </form>
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
      <div style={{ position: "fixed", bottom: "10px", left: "10px", fontSize: "12px", color: "#6c757d" }}>
        🥳 App successfully hosted..!
      </div>
      {/* Chat Popup */}
      {showChat && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "300px",
          height: "400px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "14px" }}>Ask Questions</h4>
            <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer" }}>×</button>
          </div>
          <div ref={chatMessagesRef} style={{ flex: 1, padding: "10px", overflowY: "auto", fontSize: "12px" }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "8px", textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                <div style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: "12px",
                  backgroundColor: msg.type === 'user' ? "#007bff" : "#f1f1f1",
                  color: msg.type === 'user' ? "white" : "black",
                  maxWidth: "80%",
                  wordWrap: "break-word"
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} style={{ padding: "10px", borderTop: "1px solid #eee" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about budget, rides, drivers..."
                style={{ flex: 1, padding: "6px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "12px" }}
              />
              <button type="submit" style={{ padding: "6px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "12px" }}>Send</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Chat Button */}
      <button 
        onClick={() => setShowChat(!showChat)}
        style={{
          position: "fixed",
          bottom: "80px",
          right: showChat ? "340px" : "20px",
          width: "50px",
          height: "50px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "20px",
          zIndex: 1001,
          transition: "right 0.3s ease"
        }}
      >
        💬
      </button>
      
      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          bottom: "140px",
          right: "20px",
          backgroundColor: "#28a745",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          zIndex: 1000,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          fontSize: "14px"
        }}>
          ✅ {notification}
        </div>
      )}
      
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
