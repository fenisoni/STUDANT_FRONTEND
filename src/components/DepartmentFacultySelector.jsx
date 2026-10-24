import React, { useState, useEffect, useRef } from "react";
import { api } from "../api";

/**
 * Reusable dependent Department -> Faculty selector.
 * Adheres strictly to PRD Sections 2, 3, 4, 11, 23:
 * - BOX 1: Select Department (dynamic from DB)
 * - BOX 2: Select Faculty (shows "[ Select Department first ]" until department selected)
 * - Dynamic fetch of faculty belonging strictly to the selected department
 * - Immediate clearing of faculty when department changes
 * - Server-side dynamic fetching via GET /departments/{department_id}/faculty
 */
export default function DepartmentFacultySelector({
  selectedDepartment = "",
  selectedFaculty = "",
  onDepartmentChange = () => {},
  onFacultyChange = () => {},
  departments = null,
  allowedDepartments = null,
  lockedDepartment = false,
  disabled = false,
  showHodInfo = true,
  departmentLabel = "Select Department",
  facultyLabel = "Select Faculty",
  idPrefix = "dept-fac",
  departmentError = false,
  facultyError = false,
  onDepartmentLoaded = null,
}) {
  const [deptList, setDeptList] = useState(departments || []);
  const [facultyList, setFacultyList] = useState([]);
  const [hodInfo, setHodInfo] = useState(null);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);
  const prevDeptRef = useRef(selectedDepartment);

  // Fetch departments list if not provided via props
  useEffect(() => {
    if (departments && departments.length > 0) {
      setDeptList(departments);
      return;
    }

    let isMounted = true;
    setLoadingDepts(true);
    api.getDepartments()
      .then((data) => {
        if (!isMounted) return;
        const list = data?.departments || (Array.isArray(data) ? data : []);
        setDeptList(list);
      })
      .catch((err) => {
        console.error("Failed to load departments:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingDepts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [departments]);

  // Load faculty when selectedDepartment changes
  useEffect(() => {
    const isDeptChanged = prevDeptRef.current !== selectedDepartment;
    prevDeptRef.current = selectedDepartment;

    if (!selectedDepartment) {
      setFacultyList([]);
      setHodInfo(null);
      if (selectedFaculty) {
        onFacultyChange("", null);
      }
      return;
    }

    let isMounted = true;
    setLoadingFaculty(true);

    api.getDepartmentFaculty(selectedDepartment)
      .then((data) => {
        if (!isMounted) return;
        const facs = data?.faculty || [];
        const hod = data?.hod || null;
        setFacultyList(facs);
        setHodInfo(hod);

        if (onDepartmentLoaded) {
          onDepartmentLoaded(selectedDepartment, facs, hod);
        }

        // If department changed, clear faculty selection immediately
        if (isDeptChanged && selectedFaculty) {
          const stillValid = facs.some((f) => f.faculty_id === selectedFaculty);
          if (!stillValid) {
            onFacultyChange("", null);
          }
        }
      })
      .catch((err) => {
        console.error(`Failed to load faculty for department ${selectedDepartment}:`, err);
        if (isMounted) {
          setFacultyList([]);
          setHodInfo(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingFaculty(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDepartment]);

  // Handle department dropdown change
  const handleDeptSelect = (e) => {
    const newDeptId = e.target.value;
    const deptObj = deptList.find((d) => d.dept_id === newDeptId) || null;

    // RULE: Old faculty selection MUST immediately be cleared
    onFacultyChange("", null);
    onDepartmentChange(newDeptId, deptObj);
  };

  // Handle faculty dropdown change
  const handleFacultySelect = (e) => {
    const newFacId = e.target.value;
    const facObj = facultyList.find((f) => f.faculty_id === newFacId) || null;
    onFacultyChange(newFacId, facObj);
  };

  // Filter allowed departments if specified
  const visibleDepartments = deptList.filter((d) => {
    if (!allowedDepartments) return true;
    return allowedDepartments.includes(d.dept_id);
  });

  return (
    <div
      className="dept-faculty-selector"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      {/* BOX 1: Department Selection */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <label
          htmlFor={`${idPrefix}-department`}
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#062051",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{departmentLabel} <span style={{ color: "#dc2626" }}>*</span></span>
          {loadingDepts && (
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 400 }}>
              Loading departments...
            </span>
          )}
        </label>
        <select
          id={`${idPrefix}-department`}
          className="input-field"
          style={{
            fontSize: "13px",
            padding: "9px 12px",
            fontWeight: 600,
            color: selectedDepartment ? "#062051" : "#64748b",
            background: lockedDepartment ? "#f1f5f9" : "#ffffff",
            borderColor: departmentError ? "#dc2626" : "#cbd5e1",
            borderRadius: "8px",
            cursor: lockedDepartment || disabled ? "not-allowed" : "pointer",
          }}
          value={selectedDepartment}
          onChange={handleDeptSelect}
          disabled={disabled || lockedDepartment || loadingDepts}
          required
        >
          <option value="" disabled>
            [ Select Department ▼ ]
          </option>
          {visibleDepartments.map((dept) => (
            <option key={dept.dept_id} value={dept.dept_id} style={{ color: "#0f172a" }}>
              {dept.name}
            </option>
          ))}
        </select>
        {departmentError && (
          <span style={{ fontSize: "11px", color: "#dc2626" }}>
            Please select a department.
          </span>
        )}
      </div>

      {/* BOX 2: Faculty Selection */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <label
          htmlFor={`${idPrefix}-faculty`}
          style={{
            fontSize: "12.5px",
            fontWeight: 700,
            color: "#062051",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{facultyLabel} <span style={{ color: "#dc2626" }}>*</span></span>
          {loadingFaculty && (
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 400 }}>
              Fetching department faculty...
            </span>
          )}
        </label>
        <select
          id={`${idPrefix}-faculty`}
          className="input-field"
          style={{
            fontSize: "13px",
            padding: "9px 12px",
            fontWeight: 600,
            color: selectedFaculty ? "#062051" : "#64748b",
            background: !selectedDepartment || disabled ? "#f8fafc" : "#ffffff",
            borderColor: facultyError ? "#dc2626" : "#cbd5e1",
            borderRadius: "8px",
            cursor: !selectedDepartment || disabled ? "not-allowed" : "pointer",
          }}
          value={selectedFaculty}
          onChange={handleFacultySelect}
          disabled={disabled || !selectedDepartment || loadingFaculty}
          required
        >
          {!selectedDepartment ? (
            <option value="" disabled>
              [ Select Department first ]
            </option>
          ) : loadingFaculty ? (
            <option value="" disabled>
              [ Loading faculty members... ]
            </option>
          ) : (
            <option value="" disabled>
              [ Select Faculty ▼ ]
            </option>
          )}

          {selectedDepartment &&
            facultyList.map((fac) => (
              <option key={fac.faculty_id} value={fac.faculty_id} style={{ color: "#0f172a" }}>
                {fac.name} {fac.role ? `(${fac.role})` : ""}
              </option>
            ))}
        </select>
        {facultyError && (
          <span style={{ fontSize: "11px", color: "#dc2626" }}>
            Please select a faculty member for this department.
          </span>
        )}
      </div>

      {/* Auto HOD Info Banner (PRD Section 8: Student NEVER chooses HOD) */}
      {showHodInfo && selectedDepartment && hodInfo && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "7px",
            padding: "7px 11px",
            fontSize: "11.5px",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>👑</span>
          <div>
            <strong>Department HOD:</strong> {hodInfo.name}
            <span style={{ color: "#15803d", marginLeft: "6px" }}>
              (Auto-mapped &bull; Automatically CC'd on this ticket)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
