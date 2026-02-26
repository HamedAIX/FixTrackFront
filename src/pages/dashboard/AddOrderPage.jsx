import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { db } from "../../services/api";
import "./AddOrderPage.css";

const initialForm = {
  customerName: "",
  phone: "",
  serviceType: "",
  price: "",
  description: "",
  technician: "",
};

function AddOrderPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    const loadAvailableTechnicians = async () => {
      const data = await db.technicians.find();
      setTechnicians(data.filter((tech) => tech.status === "available"));
    };

    loadAvailableTechnicians();
  }, []);

  const updateFormField = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();

    const { customerName, phone, serviceType, price, description, technician } =
      form;

    if (!customerName || !phone || !serviceType || !price) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (!/^\d{7,15}$/.test(phone)) {
      alert("الرجاء إدخال رقم هاتف صحيح (7 إلى 15 رقم)");
      return;
    }

    try {
      const now = new Date();
      const newOrder = await db.orders.insertOne({
        customerName,
        customerPhone: phone,
        serviceType,
        price: Number(price),
        description,
        technician,
        scheduledTime: {
          hours: now.getHours(),
          minutes: now.getMinutes(),
        },
      });

      alert(
        `تم إضافة الطلب بنجاح!\nرقم الطلب: ${newOrder._id}\nاحتفظ بهذا الرقم لتتبع حالة طلبك`,
      );

      resetForm();
      navigate("/dashboard/orders");
    } catch (error) {
      alert(`حدث خطأ أثناء إضافة الطلب: ${error.message}`);
      console.error("Add order error:", error);
    }
  };

  return (
    <Layout>
      <section className="add-order-page">
        <h1>إضافة طلب جديد</h1>
        <Card className="add-order-card">
          <form onSubmit={handleAddOrder}>
            <Input
              label="اسم العميل"
              type="text"
              value={form.customerName}
              onChange={(e) => updateFormField("customerName", e.target.value)}
              placeholder="أدخل اسم العميل..."
            />
            <Input
              label="رقم الهاتف"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                updateFormField("phone", e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="أدخل رقم الهاتف..."
              inputMode="numeric"
            />
            <Input
              label="نوع الخدمة"
              type="text"
              value={form.serviceType}
              onChange={(e) => updateFormField("serviceType", e.target.value)}
              placeholder="أدخل نوع الخدمة..."
            />
            <Input
              label="السعر (ريال)"
              type="number"
              value={form.price}
              onChange={(e) => updateFormField("price", e.target.value)}
              placeholder="أدخل السعر..."
            />
            <Input
              label="الوصف"
              type="text"
              value={form.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              placeholder="أدخل وصف المشكلة..."
            />
            {technicians.length > 0 && (
              <div className="input-group">
                <label>اختر الفني (اختياري)</label>
                <select
                  value={form.technician}
                  onChange={(e) => updateFormField("technician", e.target.value)}
                >
                  <option value="">اختر الفني...</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech.name}>
                      {tech.name} - {tech.specialty}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button text="إضافة الطلب" buttonType="submit" />
          </form>
        </Card>
      </section>
    </Layout>
  );
}

export default AddOrderPage;
