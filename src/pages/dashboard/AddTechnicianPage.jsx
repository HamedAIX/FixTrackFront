import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { db } from "../../services/api";
import "./AddTechnicianPage.css";

const initialForm = {
  name: "",
  phone: "",
  specialty: "",
  status: "available",
};

function AddTechnicianPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);

  const updateFormField = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleAddTechnician = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.specialty) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    try {
      await db.technicians.insertOne(form);
      alert(`تم إضافة الفني ${form.name} بنجاح!`);
      setForm(initialForm);
      navigate("/dashboard/technicians");
    } catch (error) {
      alert(`حدث خطأ أثناء إضافة الفني: ${error.message}`);
    }
  };

  return (
    <Layout>
      <section className="add-technician-page">
        <h1>إضافة فني جديد</h1>
        <Card className="add-technician-card">
          <form onSubmit={handleAddTechnician}>
            <Input
              label="اسم الفني"
              type="text"
              value={form.name}
              onChange={(e) => updateFormField("name", e.target.value)}
              placeholder="أدخل اسم الفني..."
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
              label="التخصص"
              type="text"
              value={form.specialty}
              onChange={(e) => updateFormField("specialty", e.target.value)}
              placeholder="أدخل التخصص..."
            />
            <div className="input-group">
              <label>الحالة</label>
              <select
                value={form.status}
                onChange={(e) => updateFormField("status", e.target.value)}
              >
                <option value="available">متاح</option>
                <option value="busy">مشغول</option>
                <option value="leave">اجازة</option>
              </select>
            </div>
            <Button text="إضافة الفني" buttonType="submit" />
          </form>
        </Card>
      </section>
    </Layout>
  );
}

export default AddTechnicianPage;
