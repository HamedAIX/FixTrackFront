/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { buildApiUrl } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const mapAdminToUser = (admin) => ({
    _id: admin._id,
    email: admin.email,
    name: admin.name,
    phone: admin.phone,
    role: admin.role,
    lastLogin: admin.lastLogin,
  });

  const login = async (email, password) => {
    try {
      const response = await fetch(buildApiUrl("/admin/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = mapAdminToUser(data.admin);

        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "حدث خطأ في تسجيل الدخول",
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user !== null && user.role === "admin";
  };

  const getAdminProfile = async () => {
    if (!user) {
      return null;
    }

    try {
      const queryParams = new URLSearchParams();
      if (user._id) {
        queryParams.set("adminId", user._id);
      }
      if (user.email) {
        queryParams.set("email", user.email);
      }

      const response = await fetch(
        `${buildApiUrl("/admin/profile")}?${queryParams.toString()}`,
      );
      if (!response.ok) {
        return user;
      }

      const admin = await response.json();
      if (!admin) {
        return user;
      }

      const profileData = {
        ...mapAdminToUser(admin),
        createdAt: admin.createdAt,
      };

      return profileData;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return user;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      if (!user || (!user._id && !user.email)) {
        return { success: false, error: "لم تقم بتسجيل الدخول" };
      }

      const response = await fetch(buildApiUrl("/admin/password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          adminId: user._id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || "فشل تغيير كلمة المرور" };
      }
    } catch (error) {
      console.error("Error updating password:", error);
      return {
        success: false,
        error: error.message || "حدث خطأ في تحديث كلمة المرور",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        getAdminProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
