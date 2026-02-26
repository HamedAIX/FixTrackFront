import { useState } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { db, orderStatusMessages } from "../../services/api";
import "./TrackOrderPage.css";

const defaultStatusInfo = {
  message: "حالة غير معروفة",
  color: "#6b7280",
  icon: "",
};

const statusLabelMap = {
  waiting: "قيد الانتظار",
  ready: "جاهز",
  failed: "فشل",
};

const maskPhoneNumber = (phoneNumber = "") => {
  const phone = String(phoneNumber);
  if (phone.length <= 4) {
    return phone;
  }

  return `${phone.slice(0, 4)}${"*".repeat(phone.length - 4)}`;
};

function TrackOrderPage() {
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    const orderId = searchValue.trim();
    if (!orderId) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const result = await db.orders.findOne({ _id: orderId });
      if (!result) {
        setError("الطلب غير موجود. الرجاء التأكد من رقم الطلب");
      } else {
        setOrder(result);
      }
    } catch {
      setError("حدث خطأ أثناء البحث عن الطلب");
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = order ? orderStatusMessages[order.status] || defaultStatusInfo : defaultStatusInfo;

  return (
    <Layout variant="public">
      <section className="track-order">
        <h1>تتبع طلبك</h1>

        <Card className="track-card">
          <form onSubmit={handleTrack}>
            <Input
              label="رقم الطلب"
              type="tel"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setError("");
              }}
              inputMode="numeric"
              placeholder="أدخل رقم الطلب المميز (10 أرقام)"
              dir="ltr"
            />
            <Button
              text={loading ? "جاري البحث..." : "تتبع الطلب"}
              buttonType="submit"
              disabled={loading}
            />
          </form>
        </Card>

        {error && (
          <Card className="error-card">
            <div className="error-content">
              <span className="error-icon">[!]</span>
              <p>{error}</p>
            </div>
          </Card>
        )}

        {order && (
          <Card className="result-card">
            <div className="order-info">
              <h2>معلومات الطلب</h2>

              <div className="info-row">
                <span className="label">رقم الطلب:</span>
                <span className="value">{order._id}</span>
              </div>

              <div className="info-row">
                <span className="label">اسم العميل:</span>
                <span className="value">{order.customerName}</span>
              </div>

              <div className="info-row">
                <span className="label">رقم الهاتف:</span>
                <span className="value">{maskPhoneNumber(order.customerPhone)}</span>
              </div>

              <div className="info-row">
                <span className="label">نوع الخدمة:</span>
                <span className="value">{order.serviceType}</span>
              </div>

              <div className="info-row">
                <span className="label">السعر:</span>
                <span className="value price">{order.price} ريال</span>
              </div>

              <div className="status-section">
                <h3>حالة الطلب</h3>
                <div
                  className="status-badge"
                  style={{ backgroundColor: statusInfo.color }}
                >
                  <span className="status-icon">{statusInfo.icon}</span>
                  <span className="status-text">{statusLabelMap[order.status]}</span>
                </div>
                <p className="status-message">{statusInfo.message}</p>

                {order.status === "failed" && order.failureReason && (
                  <div className="failure-reason">
                    <strong>سبب الفشل:</strong> {order.failureReason}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </section>
    </Layout>
  );
}

export default TrackOrderPage;
