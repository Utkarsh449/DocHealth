import axios from "axios";

// Mocking the client since we don't have a real backend/project ID
const BASE44_PROJECT_ID = import.meta.env.VITE_BASE44_PROJECT_ID || "mock-project-id";
const BASE_URL = `https://api.base44.com/projects/${BASE44_PROJECT_ID}`;

// Mock data store
const mockStore = {
  SymptomCheck: [],
};

// Helper to create entity methods
const createEntityMethods = (entityName) => ({
  list: async () => {
    // Mock list
    console.log(`[Mock] Listing ${entityName}`);
    return mockStore[entityName] || [];
  },
  get: async (id) => {
    // Mock get
    console.log(`[Mock] Getting ${entityName} ${id}`);
    const item = (mockStore[entityName] || []).find(i => i.id === id);
    return item || null;
  },
  create: async (data) => {
    // Mock create
    console.log(`[Mock] Creating ${entityName}`, data);
    const newItem = { ...data, id: Math.random().toString(36).substr(2, 9), created_at: new Date().toISOString() };
    if (!mockStore[entityName]) mockStore[entityName] = [];
    mockStore[entityName].push(newItem);
    return newItem;
  },
  update: async (id, data) => {
    // Mock update
    console.log(`[Mock] Updating ${entityName} ${id}`, data);
    const list = mockStore[entityName] || [];
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      return list[index];
    }
    return null;
  },
  delete: async (id) => {
    // Mock delete
    console.log(`[Mock] Deleting ${entityName} ${id}`);
    if (mockStore[entityName]) {
      mockStore[entityName] = mockStore[entityName].filter(i => i.id !== id);
    }
  },
});

export const base44 = {
  auth: {
    async login(email, password) {
      console.log("[Mock] Logging in", email);
      const token = "mock-token-" + Math.random().toString(36).substr(2);
      localStorage.setItem("base44_token", token);
      return { token, user: { email, id: "mock-user-id" } };
    },

    async logout() {
      console.log("[Mock] Logging out");
      localStorage.removeItem("base44_token");
      window.location.href = "/";
    },

    async me() {
      const token = localStorage.getItem("base44_token");
      if (!token) return null;
      return { email: "mock@example.com", id: "mock-user-id" };
    },

    async isAuthenticated() {
      const token = localStorage.getItem("base44_token");
      return !!token;
    },

    redirectToLogin(redirectUrl) {
      console.log("Redirecting to login page...");
      window.location.href = `/Login?returnUrl=${encodeURIComponent(redirectUrl || "Home")}`;
    }
  },

  // Proxy to handle base44.entities.EntityName.method()
  entities: new Proxy({}, {
    get: (target, prop) => {
      return createEntityMethods(prop);
    }
  }),
  
  // Keep the old entity property just in case
  entity: {
    async getAll(entityName) {
      return base44.entities[entityName].list();
    },
    async getOne(entityName, id) {
      return base44.entities[entityName].get(id);
    },
    async create(entityName, body) {
      return base44.entities[entityName].create(body);
    },
    async update(entityName, id, body) {
      return base44.entities[entityName].update(id, body);
    },
    async delete(entityName, id) {
      return base44.entities[entityName].delete(id);
    },
  }
};
