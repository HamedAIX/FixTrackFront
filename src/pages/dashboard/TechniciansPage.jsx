import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { db } from "../../services/api";
import "./TechniciansPage.css";

const technicianStatusLabelMap = {
  available: "متاح",
  busy: "مشغول",
  leave: "اجازة",
};

const technicianStatusValueMap = {
  متاح: "available",
  مشغول: "busy",
  اجازة: "leave",
};

function TechniciansPage() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTechnicians = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.technicians.find();
      setTechnicians(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  const tableData = useMemo(() => {
    return technicians.map((tech) => ({
      _id: tech._id,
      الاسم: tech.name,
      رقم_الهاتف: tech.phone,
      التخصص: tech.specialty,
      الحالة: technicianStatusLabelMap[tech.status] || "اجازة",
    }));
  }, [technicians]);

  const handleDelete = async (technician) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفني ${technician.الاسم}؟`)) {
      return;
    }

    try {
      await db.technicians.deleteOne({ _id: technician._id });
      await loadTechnicians();
      alert("تم حذف الفني بنجاح");
    } catch (error) {
      alert(`حدث خطأ أثناء الحذف: ${error.message}`);
    }
  };

  const handleStatusChange = async (technician, newStatus) => {
    try {
      await db.technicians.updateOne(
        { _id: technician._id },
        { $set: { status: technicianStatusValueMap[newStatus] || "leave" } },
      );
      await loadTechnicians();
      alert(`تم تحديث حالة ${technician.الاسم} إلى: ${newStatus}`);
    } catch (error) {
      alert(`حدث خطأ أثناء التحديث: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="technicians-page">
          <p>جاري تحميل البيانات...</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="technicians-page">
        <div className="page-header">
          <h1>الفنيين</h1>
          <Button
            text="+ إضافة فني جديد"
            onClick={() => navigate("/dashboard/add-technician")}
          />
        </div>
        <Table
          columns={["الاسم", "رقم الهاتف", "التخصص", "الحالة", "إجراءات"]}
          data={tableData}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </section>
    </Layout>
  );
}

export default TechniciansPage;
