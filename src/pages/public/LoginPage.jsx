import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./LoginPage.css";

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setCredentials((previousCredentials) => ({
      ...previousCredentials,
      [field]: value,
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    const result = await login(credentials.email, credentials.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setError(result.error || "فشل تسجيل الدخول");
  };

  return (
    <Layout variant="public">
      <div className="login-page">
        <Card className="login-card">
          <h2>تسجيل دخول الأدمن</h2>
          <p className="login-subtitle">
            أدخل بيانات الأدمن للوصول للوحة التحكم
          </p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={credentials.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="admin@fixtrack.com"
              dir="ltr"
            />
            <Input
              label="كلمة المرور"
              type="password"
              value={credentials.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="أدخل كلمة المرور"
            />
            <Button
              text={loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              buttonType="submit"
              disabled={loading}
            />
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default LoginPage;
