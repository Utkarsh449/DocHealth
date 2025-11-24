import axios from "axios";

const BASE44_PROJECT_ID = process.env.REACT_APP_BASE44_PROJECT_ID || "";
const BASE_URL = `https://api.base44.com/projects/${BASE44_PROJECT_ID}`;

export const base44 = {
  auth: {
    async login(email, password) {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("base44_token", res.data.token);
      return res.data;
    },

    async logout() {
      localStorage.removeItem("base44_token");
      window.location.href = "/Home";
    },

    async me() {
      const token = localStorage.getItem("base44_token");
      if (!token) return null;

      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (error) {
        return null;
      }
    },
  },

  entity: {
    async getAll(entityName) {
      const token = localStorage.getItem("base44_token");
      const res = await axios.get(`${BASE_URL}/entities/${entityName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },

    async getOne(entityName, id) {
      const token = localStorage.getItem("base44_token");
      const res = await axios.get(`${BASE_URL}/entities/${entityName}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },

    async create(entityName, body) {
      const token = localStorage.getItem("base44_token");
      const res = await axios.post(`${BASE_URL}/entities/${entityName}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },

    async update(entityName, id, body) {
      const token = localStorage.getItem("base44_token");
      const res = await axios.put(
        `${BASE_URL}/entities/${entityName}/${id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },

    async delete(entityName, id) {
      const token = localStorage.getItem("base44_token");
      const res = await axios.delete(
        `${BASE_URL}/entities/${entityName}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  },
};
