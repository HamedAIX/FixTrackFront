const rawApiUrl = (import.meta.env.VITE_API_URL || "").trim();
const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");
const API_URL = normalizedApiUrl
  ? normalizedApiUrl.endsWith("/api")
    ? normalizedApiUrl
    : `${normalizedApiUrl}/api`
  : "/api";

export const buildApiUrl = (endpoint = "") => {
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
};

// دالة موحدة لطلبات API لضمان معالجة الأخطاء بنفس الأسلوب في كل المشروع.
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

export const db = {
  orders: {
    findOne: async (query) => {
      if (!query._id) {
        return null;
      }

      try {
        return await apiCall(`/orders/${query._id}`);
      } catch {
        return null;
      }
    },

    find: () => apiCall("/orders"),
    getStats: () => apiCall("/orders-stats"),

    insertOne: (document) =>
      apiCall("/orders", {
        method: "POST",
        body: JSON.stringify(document),
      }),

    updateOne: (query, update) => {
      if (!update.$set) {
        return null;
      }

      return apiCall(`/orders/${query._id}`, {
        method: "PUT",
        body: JSON.stringify(update.$set),
      });
    },

    deleteOne: (query) =>
      apiCall(`/orders/${query._id}`, {
        method: "DELETE",
      }),
  },

  technicians: {
    find: () => apiCall("/technicians"),

    insertOne: (document) =>
      apiCall("/technicians", {
        method: "POST",
        body: JSON.stringify(document),
      }),

    updateOne: (query, update) => {
      if (!update.$set) {
        return null;
      }

      return apiCall(`/technicians/${query._id}`, {
        method: "PUT",
        body: JSON.stringify(update.$set),
      });
    },

    deleteOne: (query) =>
      apiCall(`/technicians/${query._id}`, {
        method: "DELETE",
      }),
  },
};

// رسائل حالة الطلب المعروضة للعميل في صفحة التتبع.
export const orderStatusMessages = {
  waiting: {
    message: "نحن نعمل الآن على طلبك، الرجاء الانتظار",
    color: "#f59e0b",
    icon: "",
  },
  ready: {
    message: "طلبك جاهز! يمكنك الآن الحصول عليه",
    color: "#10b981",
    icon: "",
  },
  failed: {
    message: "يجب عليك الحضور فورًا لفهم سبب المشكلة",
    color: "#ef4444",
    icon: "",
  },
};

export default db;
