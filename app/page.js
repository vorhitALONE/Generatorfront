"use client";

import { useEffect, useMemo, useState } from "react";
import "./globals.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Page() {
  const [activeValue, setActiveValue] = useState(null);
  const [generatedValue, setGeneratedValue] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newValues, setNewValues] = useState("");
  const [authToken, setAuthToken] = useState(null);

  // UI controls (как в оригинале)
  const [seqCount, setSeqCount] = useState(1);
  const [sourceMode, setSourceMode] = useState("range");
  const [rangeFrom, setRangeFrom] = useState("1");
  const [rangeTo, setRangeTo] = useState("100");
  const [excludeEnabled, setExcludeEnabled] = useState(false);
  const [exclude, setExclude] = useState("");

  const shownNumber = useMemo(() => {
    if (generatedValue !== null) return String(generatedValue);
    if (activeValue !== null) return String(activeValue);
    return "";
  }, [generatedValue, activeValue]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setAuthToken(token);

    fetchActiveValue();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (authToken) checkAdminSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const checkAdminSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      const ok = Boolean(data.authenticated);
      setIsAdmin(ok);
      if (!ok) {
        localStorage.removeItem("adminToken");
        setAuthToken(null);
      }
    } catch {
      localStorage.removeItem("adminToken");
      setAuthToken(null);
    }
  };

  const fetchActiveValue = async () => {
    try {
      const response = await fetch(`${API_URL}/api/active`, { cache: "no-store" });
      const data = await response.json();
      setActiveValue(data.value);
    } catch {
      // не ломаем UI
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/history`, { cache: "no-store" });
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seqCount,
          sourceMode,
          rangeFrom,
          rangeTo,
          exclude: excludeEnabled ? exclude : "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Не удалось сгенерировать");
      setGeneratedValue(data.value);
      await fetchHistory();
      await fetchActiveValue();
    } catch (e) {
      setError(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Неверные данные");

      localStorage.setItem("adminToken", data.token);
      setAuthToken(data.token);
      setIsAdmin(true);
      setAdminUsername("");
      setAdminPassword("");
    } catch (e2) {
      setError(e2?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("adminToken");
      setAuthToken(null);
      setIsAdmin(false);
    }
  };

  const handleSetValues = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const values = newValues
        .split(/[\s,;\n]+/)
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => parseInt(v, 10))
        .filter((v) => Number.isFinite(v));

      if (!values.length) throw new Error("Введите числа (пример: 10 20 30)");

      const response = await fetch(`${API_URL}/api/admin/active`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ values }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Не удалось сохранить");

      setNewValues("");
      await fetchActiveValue();
      await fetchHistory();
    } catch (e2) {
      setError(e2?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-text">RandStuff</div>
          </div>

          <nav className="nav">
            <a className="nav-item active" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon">123</span>
              Числа
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon"><i className="fa-solid fa-trophy"></i></span>
              Определить<br />победителя
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon">***</span>
              Пароли
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon"><i className="fa-solid fa-dharmachakra"></i></span>
              Колесо<br />фортуны
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon">???</span>
              Вопросы
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon"><i className="fa-solid fa-ticket"></i></span>
              Счастливые<br />билеты
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon"><i className="fa-solid fa-scroll"></i></span>
              Мудрости
            </a>

            <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="icon"><i className="fa-solid fa-circle-question"></i></span>
              Ответы и<br />предсказания
            </a>
          </nav>

          {/* кнопка админа справа (точно кликается) */}
          <button
            type="button"
            className="admin-btn"
            onClick={() => setShowAdminModal(true)}
          >
            <i className="fa-solid fa-user-gear" style={{ marginRight: 6 }}></i>
            Админ
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-wrap">
        <div className="big-title">Случайное число:</div>
        <div className="big-number">{shownNumber || "0"}</div>

        <div className="small-links">
          <div><a className="link-red" href="#" onClick={(e) => e.preventDefault()}>Проводите розыгрыш во ВКонтакте?</a></div>
          <div><a className="link-red" href="#" onClick={(e) => e.preventDefault()}>Мы поможем определить победителя!</a></div>
        </div>

        <button className="btn-generate" disabled={loading} onClick={handleGenerate}>
          {loading ? "..." : "Сгенерировать"}
        </button>

        <div className="controls">
          <div style={{ marginTop: 18, color: "#666" }}>новую последовательность из</div>
          <input
            className="range"
            type="range"
            min="1"
            max="50"
            value={seqCount}
            onChange={(e) => setSeqCount(parseInt(e.target.value, 10))}
          />
          <div style={{ marginTop: 6 }}>{seqCount} случайного числа</div>

          <div style={{ marginTop: 10 }}>
            <label style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="src"
                checked={sourceMode === "range"}
                onChange={() => setSourceMode("range")}
              />{" "}
              <span className="link-red" style={{ borderBottomColor: "#000", color: "#000" }}>из диапазона</span>
            </label>
            <span style={{ color: "#888" }}>или</span>
            <label style={{ marginLeft: 8 }}>
              <input
                type="radio"
                name="src"
                checked={sourceMode === "list"}
                onChange={() => setSourceMode("list")}
              />{" "}
              из списка
            </label>
          </div>

          <div style={{ marginTop: 10 }}>
            от{" "}
            <input className="input" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} />
            {" "}до{" "}
            <input className="input" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={excludeEnabled}
                onChange={(e) => setExcludeEnabled(e.target.checked)}
              />{" "}
              исключить числа
            </label>
          </div>

          {excludeEnabled && (
            <div style={{ marginTop: 8 }}>
              <input
                className="input"
                style={{ width: 220, textAlign: "left" }}
                placeholder="например: 3, 7, 15"
                value={exclude}
                onChange={(e) => setExclude(e.target.value)}
              />
            </div>
          )}

          {error && <div className="alert" style={{ maxWidth: 520, margin: "14px auto 0" }}>{error}</div>}
        </div>

        {/* history */}
        <div className="history-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700 }}>История генераций</div>
            <button className="link-red" style={{ background: "transparent", border: 0, cursor: "pointer" }} onClick={fetchHistory}>
              обновить
            </button>
          </div>

          <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            {history?.length ? (
              history.slice(0, 50).map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ width: 90, fontWeight: 700, color: "#222" }}>{h.value}</div>
                  <div style={{ width: 120, color: "#444" }}>{h.actor === "admin" ? "Админ" : "Пользователь"}</div>
                  <div style={{ flex: 1, textAlign: "right" }}>
                    {h.timestamp ? new Date(h.timestamp).toLocaleString("ru-RU") : ""}
                  </div>
                </div>
              ))
            ) : (
              <div>История пуста</div>
            )}
          </div>
        </div>
      </main>

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdminModal(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-user-gear" style={{ marginRight: 8 }}></i>
                Администрирование
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                style={{ background: "transparent", border: 0, color: "#fff", cursor: "pointer", fontSize: 18 }}
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {!isAdmin ? (
                <form onSubmit={handleAdminLogin} style={{ display: "grid", gap: 10 }}>
                  <div style={{ color: "#666", fontSize: 13 }}>Вход в панель администратора</div>

                  <input className="field" placeholder="Логин" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
                  <input className="field" placeholder="Пароль" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />

                  <button className="small-btn" type="submit" disabled={loading}>
                    {loading ? "..." : "Войти"}
                  </button>
                </form>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, color: "#222" }}>Панель администратора</div>
                    <button className="danger-btn" type="button" onClick={handleAdminLogout}>Выйти</button>
                  </div>

                  <form onSubmit={handleSetValues} style={{ display: "grid", gap: 10 }}>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      Установить серию чисел (пробел/запятая/новая строка)
                    </div>

                    <textarea
                      className="field"
                      rows={4}
                      placeholder="Например: 10 20 30 40"
                      value={newValues}
                      onChange={(e) => setNewValues(e.target.value)}
                    />

                    <button className="small-btn" type="submit" disabled={loading}>
                      {loading ? "..." : "Сохранить"}
                    </button>
                  </form>
                </div>
              )}

              {error && <div className="alert" style={{ marginTop: 12 }}>{error}</div>}
              <div style={{ marginTop: 12, fontSize: 12, color: "#777" }}>
                API: <span style={{ fontFamily: "monospace" }}>{API_URL}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
