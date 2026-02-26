import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { db, orderStatusMessages } from "../../services/api";
import "./OrderDetailsPage.css";

const statusLabelMap = {
  waiting: "قيد الانتظار",
  ready: "جاهز",
  failed: "فشل",
};

const defaultStatusInfo = {
  message: "حالة غير معروفة",
  color: "#6b7280",
  icon: "",
};

function OrderDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failureReason, setFailureReason] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.orders.findOne({ _id: orderNumber });
      setOrder(data);
      setFailureReason(data?.failureReason || "");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const currentStatus = selectedStatus || order?.status || "waiting";
  const statusInfo = order ? orderStatusMessages[order.status] || defaultStatusInfo : defaultStatusInfo;

  const handleStatusChange = async (newStatus) => {
    const updateData = { status: newStatus };

    if (newStatus === "failed") {
      if (!failureReason.trim()) {
        alert("الرجاء إدخال سبب الفشل");
        return;
      }
      updateData.failureReason = failureReason;
    } else {
      updateData.failureReason = null;
    }

    try {
      await db.orders.updateOne({ _id: orderNumber }, { $set: updateData });
      await loadOrder();
      setSelectedStatus("");
      alert(`تم تحديث حالة الطلب إلى: ${statusLabelMap[newStatus]}`);
    } catch (error) {
      alert(`حدث خطأ أثناء تحديث الحالة: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="order-details-page">
          <h1>تفاصيل الطلب</h1>
          <Card className="order-details-card">
            <p>جاري تحميل البيانات...</p>
          </Card>
        </section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <section className="order-details-page">
          <h1>تفاصيل الطلب</h1>
          <Card className="order-details-card">
            <p className="not-found">الطلب غير موجود</p>
            <Button text="عودة للطلبات" onClick={() => navigate("/dashboard/orders")} />
          </Card>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="order-details-page">
        <h1>تفاصيل الطلب</h1>

        <div className="customer-note">
          <span className="note-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z"
                stroke="#b45309"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="13" r="4" stroke="#b45309" strokeWidth="2" />
            </svg>
          </span>
          <div className="note-text">
            <strong>لضمان تتبع طلبك:</strong>
            <span>يمكنك تصوير هذه الشاشة أو حفظ رقم الطلب</span>
            <a
              href="https://www.fixtrack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-link"
            >
              www.fixtrack.com
            </a>
          </div>
        </div>

        <Card className="order-details-card">
          <div className="order-info">
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
              <span className="value">{order.customerPhone}</span>
            </div>
            <div className="info-row">
              <span className="label">نوع الخدمة:</span>
              <span className="value">{order.serviceType}</span>
            </div>
            <div className="info-row">
              <span className="label">السعر:</span>
              <span className="value price">{order.price} ريال</span>
            </div>
            {order.description && (
              <div className="info-row">
                <span className="label">الوصف:</span>
                <span className="value">{order.description}</span>
              </div>
            )}
            {order.technician && (
              <div className="info-row">
                <span className="label">الفني المسؤول:</span>
                <span className="value technician">{order.technician}</span>
              </div>
            )}
            {order.scheduledTime && (
              <div className="info-row">
                <span className="label">وقت إنشاء الطلب:</span>
                <span className="value time">
                  {order.scheduledTime.hours}:
                  {order.scheduledTime.minutes.toString().padStart(2, "0")}
                </span>
              </div>
            )}
            <div className="info-row">
              <span className="label">تاريخ الطلب:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleDateString("ar-SA")}
              </span>
            </div>

            <div className="status-section">
              <h3>الحالة الحالية</h3>
              <div className="status-badge" style={{ backgroundColor: statusInfo.color }}>
                <span className="status-icon">{statusInfo.icon}</span>
                <span className="status-text">{statusLabelMap[order.status]}</span>
              </div>
            </div>

            <div className="status-update">
              <label>تغيير الحالة:</label>
              <select
                value={currentStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  if (e.target.value !== "failed") {
                    setFailureReason("");
                  }
                }}
              >
                <option value="waiting">قيد الانتظار</option>
                <option value="ready">جاهز</option>
                <option value="failed">فشل</option>
              </select>
              <Button
                text="تحديث الحالة"
                onClick={() => handleStatusChange(currentStatus)}
              />
            </div>

            {currentStatus === "failed" && (
              <div className="failure-reason-input">
                <Input
                  label="سبب الفشل"
                  type="text"
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="أدخل سبب فشل الطلب..."
                />
                <Button text="تحديث السبب" onClick={() => handleStatusChange("failed")} />
              </div>
            )}

            {order.status === "failed" && order.failureReason && (
              <div className="failure-reason-display">
                <strong>سبب الفشل:</strong> {order.failureReason}
              </div>
            )}
          </div>

          <Button text="عودة للطلبات" onClick={() => navigate("/dashboard/orders")} />
        </Card>
      </section>
    </Layout>
  );
}

export default OrderDetailsPage;
