import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import "./UnauthorizedPage.css";

function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Layout variant="public">
      <div className="unauthorized-page">
        <Card className="unauthorized-card">
          <div className="unauthorized-icon">X</div>
          <h1>غير مصرح لك بالوصول</h1>
          <p>عذراً، لا تملك الصلاحية للوصول إلى هذه الصفحة.</p>
          <div className="unauthorized-actions">
            <Button text="العودة للرئيسية" onClick={handleGoBack} />
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default UnauthorizedPage;
