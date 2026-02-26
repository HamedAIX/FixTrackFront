import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/layout/Layout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { buildApiUrl } from "../../services/api";
import "./ProfilePage.css";

function ProfilePage() {
  const { getAdminProfile, updatePassword } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // نستخدم useCallback حتى لا يُعاد إنشاء الدالة في كل إعادة رسم بلا حاجة.
  const loadProfile = useCallback(async () => {
    try {
      const data = await getAdminProfile();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, [getAdminProfile]);

  useEffect(() => {
    setLoading(true);
    loadProfile();
  }, [loadProfile]);

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleEditClick = () => {
    setEditName(profile?.name || "");
    setEditEmail(profile?.email || "");
    setEditPhone(profile?.phone || "");
    setIsEditing(true);
    setEditError("");
    setEditSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError("");
    setEditSuccess("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");

    if (!editName || !editEmail || !editPhone) {
      setEditError("الرجاء ملء جميع الحقول");
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/admin/profile"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          adminId: profile?._id,
          currentEmail: profile?.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditSuccess("تم تحديث البيانات بنجاح!");
        setProfile(data);
        setIsEditing(false);
      } else {
        setEditError(data.error || "حدث خطأ");
      }
    } catch (error) {
      setEditError("حدث خطأ في الاتصال");
      console.error(error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("الرجاء ملء جميع الحقول");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);

    if (result.success) {
      setPasswordSuccess("تم تحديث كلمة المرور بنجاح!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(result.error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-page">
          <p>جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="profile-page">
        <h1>الملف الشخصي للأدمن</h1>

        <div className="cards-container">
          <Card className="profile-card">
            <h2>معلومات الحساب</h2>
            {editError && <div className="error-message">{editError}</div>}
            {editSuccess && <div className="success-message">{editSuccess}</div>}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <Input
                  label="الاسم"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="أدخل الاسم"
                />
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  dir="ltr"
                />
                <Input
                  label="رقم الهاتف"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="أدخل رقم الهاتف"
                  inputMode="numeric"
                />
                <div className="edit-buttons">
                  <Button text="حفظ" buttonType="submit" />
                  <Button text="إلغاء" onClick={handleCancelEdit} buttonType="button" />
                </div>
              </form>
            ) : (
              <>
                <div className="profile-info">
                  <div className="info-row">
                    <span className="label">الاسم:</span>
                    <span className="value">{profile?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">البريد الإلكتروني:</span>
                    <span className="value">{profile?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">رقم الهاتف:</span>
                    <span className="value">{profile?.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">كلمة المرور:</span>
                    <span className="value password">••••••••</span>
                  </div>
                  <div className="info-row">
                    <span className="label">الدور:</span>
                    <span className="value role">أدمن</span>
                  </div>
                  {profile?.lastLogin && (
                    <div className="info-row">
                      <span className="label">آخر تسجيل دخول:</span>
                      <span className="value">
                        {new Date(profile.lastLogin).toLocaleString("ar-SA")}
                      </span>
                    </div>
                  )}
                </div>
                <Button text="تعديل البيانات" onClick={handleEditClick} />
              </>
            )}
          </Card>

          <Card className="password-card">
            <h2>تغيير كلمة المرور</h2>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="success-message">{passwordSuccess}</div>
            )}
            <form onSubmit={handleUpdatePassword}>
              <Input
                label="كلمة المرور الحالية"
                type="password"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                placeholder="أدخل كلمة المرور الحالية"
                dir="ltr"
              />
              <Input
                label="كلمة المرور الجديدة"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="أدخل كلمة المرور الجديدة"
                dir="ltr"
              />
              <Input
                label="تأكيد كلمة المرور الجديدة"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                dir="ltr"
              />
              <Button text="تغيير كلمة المرور" buttonType="submit" />
            </form>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

export default ProfilePage;
