import { useState, useEffect, useCallback } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import { db } from "../../services/api";
import "./DashboardPage.css";

const initialStats = {
  totalOrders: 0,
  waitingOrders: 0,
  readyOrders: 0,
  failedOrders: 0,
  completedRevenue: 0,
  pendingRevenue: 0,
};

function DashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.orders.getStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <Layout>
        <section className="dashboard-home">
          <h1>لوحة التحكم</h1>
          <p>جاري تحميل البيانات...</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="dashboard-home">
        <h1>لوحة التحكم</h1>
        <div className="cards-container">
          <Card className="stat-card">
            <h3>عدد الطلبات</h3>
            <p>{stats.totalOrders}</p>
          </Card>
          <Card className="stat-card">
            <h3>الطلبات المعلقة</h3>
            <p>{stats.waitingOrders}</p>
          </Card>
          <Card className="stat-card">
            <h3>الطلبات الجاهزة</h3>
            <p>{stats.readyOrders}</p>
          </Card>
          <Card className="stat-card">
            <h3>الطلبات الفاشلة</h3>
            <p>{stats.failedOrders}</p>
          </Card>
          <Card className="stat-card profit-card">
            <h3>الأرباح المحققة</h3>
            <p className="profit-value">
              {stats.completedRevenue.toLocaleString()} ريال
            </p>
          </Card>
          <Card className="stat-card pending-card">
            <h3>الأرباح المعلقة</h3>
            <p className="pending-value">
              {stats.pendingRevenue.toLocaleString()} ريال
            </p>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

export default DashboardPage;
