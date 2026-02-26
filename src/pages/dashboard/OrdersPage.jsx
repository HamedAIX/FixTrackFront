import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { db } from "../../services/api";
import "./OrdersPage.css";

const orderStatusLabelMap = {
  waiting: "قيد الانتظار",
  ready: "جاهز",
  failed: "فشل",
};

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.orders.find();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const tableData = useMemo(() => {
    return orders.map((order) => ({
      _id: order._id,
      createdAtTs: new Date(order.createdAt).getTime(),
      رقم_الطلب: order._id,
      العميل: order.customerName,
      الخدمة: order.serviceType,
      السعر: order.price,
      الحالة: orderStatusLabelMap[order.status] || "فشل",
      الفني: order.technician || "-",
      تاريخ_الطلب: new Date(order.createdAt).toLocaleDateString("ar-SA"),
      إجراءات: "",
    }));
  }, [orders]);

  const filteredAndSortedOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? tableData.filter(
          (order) =>
            order.رقم_الطلب.toLowerCase().includes(term) ||
            order.العميل.toLowerCase().includes(term),
        )
      : tableData;

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === "price") {
        comparison = Number(a.السعر) - Number(b.السعر);
      } else if (sortBy === "date") {
        comparison = a.createdAtTs - b.createdAtTs;
      } else if (sortBy === "status") {
        comparison = a.الحالة.localeCompare(b.الحالة);
      } else if (sortBy === "customer") {
        comparison = a.العميل.localeCompare(b.العميل);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [tableData, searchTerm, sortBy, sortOrder]);

  const handleDelete = async (order) => {
    const orderId = order._id || order.رقم_الطلب;
    if (!window.confirm(`هل أنت متأكد من حذف الطلب رقم ${orderId}؟`)) {
      return;
    }

    try {
      await db.orders.deleteOne({ _id: orderId });
      await loadOrders();
      alert("تم حذف الطلب بنجاح");
    } catch (error) {
      alert(`حدث خطأ أثناء حذف الطلب: ${error.message}`);
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="orders-page">
          <p>جاري تحميل الطلبات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="orders-page">
        <h1>الطلبات</h1>

        <div className="filters-container">
          <div className="search-box">
            <Input
              label="بحث"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الطلب أو اسم العميل..."
            />
          </div>

          <div className="sort-controls">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">ترتيب حسب التاريخ</option>
              <option value="price">ترتيب حسب السعر</option>
              <option value="status">ترتيب حسب الحالة</option>
              <option value="customer">ترتيب حسب العميل</option>
            </select>

            <Button
              text={sortOrder === "asc" ? "↑" : "↓"}
              onClick={() =>
                setSortOrder((currentOrder) =>
                  currentOrder === "asc" ? "desc" : "asc",
                )
              }
            />
          </div>
        </div>

        <div className="results-info">
          <p>عدد النتائج: {filteredAndSortedOrders.length}</p>
        </div>

        <Table
          columns={[
            "رقم الطلب",
            "العميل",
            "الخدمة",
            "السعر",
            "الحالة",
            "الفني",
            "تاريخ الطلب",
            "إجراءات",
          ]}
          data={filteredAndSortedOrders}
          onRowClick={(order) =>
            navigate(`/dashboard/order-details?order=${order.رقم_الطلب}`)
          }
          onDelete={handleDelete}
        />
      </section>
    </Layout>
  );
}

export default OrdersPage;
