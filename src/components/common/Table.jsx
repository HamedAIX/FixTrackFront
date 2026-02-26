import "./Table.css";

const columnKeyMap = {
  "رقم الطلب": "رقم_الطلب",
  العميل: "العميل",
  الخدمة: "الخدمة",
  السعر: "السعر",
  الحالة: "الحالة",
  الفني: "الفني",
  "تاريخ الطلب": "تاريخ_الطلب",
  الاسم: "الاسم",
  "رقم الهاتف": "رقم_الهاتف",
  التخصص: "التخصص",
  إجراءات: "إجراءات",
};

function Table({
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusColumnIndex = columns.indexOf("الحالة");
  const actionsColumnIndex = columns.indexOf("إجراءات");

  const getStatusClass = (status) => {
    if (status === "جاهز" || status === "متاح") return "status-ready";
    if (status === "قيد الانتظار" || status === "انتظار") return "status-pending";
    if (status === "فشل" || status === "مشغول") return "status-failed";
    if (status === "اجازة" || status === "في إجازة") return "status-leave";
    return "";
  };

  // نربط أسماء الأعمدة العربية بمفاتيح البيانات المستخدمة داخل الصف.
  const getRowValues = (row) => {
    return columns.map((col) => row[columnKeyMap[col] || col]);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const values = getRowValues(row);

            return (
              <tr
                key={row._id || row.رقم_الطلب || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "clickable-row" : ""}
              >
                {values.map((value, colIndex) => {
                  const isStatusColumn = colIndex === statusColumnIndex;
                  const isActionsColumn = colIndex === actionsColumnIndex;

                  return (
                    <td key={colIndex} className={isStatusColumn ? "status-cell" : ""}>
                      {isStatusColumn && onStatusChange ? (
                        <select
                          value={value}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(row, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`status-select status-colored ${getStatusClass(value)}`}
                        >
                          <option value="متاح">متاح</option>
                          <option value="مشغول">مشغول</option>
                          <option value="اجازة">اجازة</option>
                        </select>
                      ) : isStatusColumn ? (
                        <span
                          className={`status-badge ${getStatusClass(value)}`}
                        >
                          {value}
                        </span>
                      ) : isActionsColumn ? (
                        <div className="action-buttons">
                          {onEdit && (
                            <button
                              className="btn-edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                            >
                              تعديل
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="btn-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                              }}
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
