import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Layout variant="public">
      <section className="hero">
        <h1>مرحبًا بك في FixTrack</h1>
        <p>تتبع وادارة طلبات الخدمة بسهولة</p>
        <div className="hero-buttons">
          <Button text="تتبع الطلب" onClick={() => navigate("/track-order")} />
        </div>
      </section>
    </Layout>
  );
}

export default LandingPage;
