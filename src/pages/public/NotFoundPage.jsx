import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import "./NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout variant="public">
      <section className="not-found">
        <h1>404</h1>
        <p>عذرًا، الصفحة التي تبحث عنها غير موجودة.</p>
        <Button text="العودة للرئيسية" onClick={handleGoHome} />
      </section>
    </Layout>
  );
}

export default NotFoundPage;
