"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Page() {
  const [activeValue, setActiveValue] = useState(21);       // как в макете по умолчанию
  const [generatedValue, setGeneratedValue] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // controls (как в макете)
  const [seqCount, setSeqCount] = useState(1);
  const [sourceMode, setSourceMode] = useState("range");
  const [rangeFrom, setRangeFrom] = useState("1");
  const [rangeTo, setRangeTo] = useState("100");

  // admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newValues, setNewValues] = useState("");
  const [authToken, setAuthToken] = useState(null);

  const shownNumber = useMemo(() => {
    if (generatedValue !== null) return generatedValue;
    return activeValue ?? 21;
  }, [generatedValue, activeValue]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (token) setAuthToken(token);

    // если API_URL не задан — просто остаёмся на “макетных” 21
    if (!API_URL) return;

    fetchActiveValue();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!API_URL) return;
    if (authToken) checkAdminSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  const fetchActiveValue = async () => {
    try {
      const r = await fetch(`${API_URL}/api/active`, { cache: "no-store" });
      const d = await r.json();
      if (typeof d.value !== "undefined") setActiveValue(d.value);
    } catch {}
  };

  const fetchHistory = async () => {
    try {
      const r = await fetch(`${API_URL}/api/history`, { cache: "no-store" });
      const d = await r.json();
      setHistory(Array.isArray(d) ? d : []);
    } catch {}
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!API_URL) throw new Error("Не задан NEXT_PUBLIC_API_URL");

      const r = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seqCount,
          sourceMode,
          rangeFrom,
          rangeTo
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка генерации");

      setGeneratedValue(d.value);
      await fetchHistory();
      await fetchActiveValue();
    } catch (e) {
      setError(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const checkAdminSession = async () => {
    try {
      const r = await fetch(`${API_URL}/api/admin/check`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const d = await r.json();
      const ok = Boolean(d.authenticated);
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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const r = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Неверные данные");

      localStorage.setItem("adminToken", d.token);
      setAuthToken(d.token);
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
    } catch {}
    localStorage.removeItem("adminToken");
    setAuthToken(null);
    setIsAdmin(false);
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

      const r = await fetch(`${API_URL}/api/admin/active`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ values }),
      });

      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Не удалось сохранить");

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
      {/* Header — 1:1 из исходника */}
      <header id="header-main" className="header-bg w-full h-[85px] relative z-10">
        <div className="max-w-[980px] mx-auto h-full flex items-start">
          {/* Logo */}
          <div className="logo-ribbon w-[110px] h-[95px] flex items-center justify-center rounded-b-md mr-6 relative top-[-5px]">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#222] font-['Lobster'] text-3xl no-underline transform -rotate-3 mt-2">
              RandStuff
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex-1 h-full flex items-center justify-between pt-2">
            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item active flex flex-col items-center gap-1 group w-16 text-center no-underline">
              <div className="menu-icon text-2xl font-bold font-sans">123</div>
              <span className="menu-text text-[11px] text-white leading-tight">Числа</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-20 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-trophy text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Определить<br />победителя</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <div className="menu-icon text-xl font-bold tracking-widest">***</div>
              <span className="menu-text text-[11px] leading-tight">Пароли</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-dharmachakra text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Колесо<br />фортуны</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <div className="menu-icon text-xl font-bold">???</div>
              <span className="menu-text text-[11px] leading-tight">Вопросы</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-20 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-ticket text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Счастливые<br />билеты</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-scroll text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Мудрости</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-20 text-center no-underline text-gray-300">
              <span className="menu-icon fa-stack text-[10px]" style={{ fontSize: "0.7rem" }}>
                <i className="fa-solid fa-circle fa-stack-2x"></i>
                <i className="fa-solid fa-8 fa-stack-1x fa-inverse"></i>
              </span>
              <span className="menu-text text-[11px] leading-tight mt-1">Ответы и<br />предсказания</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-exclamation text-xl w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold"></i>
              <span className="menu-text text-[11px] leading-tight">Факты</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-list-check text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Чек-лист<br />дел жизни</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-20 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-heart text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Комплименты</span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()} className="menu-item flex flex-col items-center gap-1 group w-16 text-center no-underline text-gray-300">
              <i className="menu-icon fa-solid fa-user text-xl"></i>
              <span className="menu-text text-[11px] leading-tight">Личный<br />кабинет</span>
            </a>

            {/* Админ (добавлено аккуратно) */}
            <button
              type="button"
              className="admin-btn"
              onClick={() => setShowAdminModal(true)}
              title="Админ"
            >
              <i className="fa-solid fa-user-gear mr-1"></i> Админ
            </button>
          </nav>
        </div>
      </header>

      {/* Main — 1:1 из исходника */}
      <main id="main-content" className="flex-1 w-full max-w-[980px] mx-auto pt-12 pb-20 text-center">
        <h1 className="text-[32px] text-black mb-2 font-normal">Случайное число:</h1>

        <div className="text-[160px] leading-none font-normal text-black mb-4 tracking-tighter">
          {shownNumber}
        </div>

        <div className="mb-8">
          <a href="#" onClick={(e) => e.preventDefault()} className="link-dashed text-[13px]">Проводите розыгрыш во ВКонтакте?</a><br />
          <a href="#" onClick={(e) => e.preventDefault()} className="link-dashed text-[13px]">Мы поможем определить победителя!</a>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-generate text-[#222] text-[36px] font-bold px-12 py-2 rounded-lg cursor-pointer select-none w-[340px]"
          >
            {loading ? "..." : "Сгенерировать"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 text-[13px] text-[#333]">
          <div className="w-[300px] text-center">
            <div className="text-gray-600 mb-1">новую последовательность из</div>
            <input
              type="range"
              min="1"
              max="50"
              value={seqCount}
              onChange={(e) => setSeqCount(parseInt(e.target.value, 10))}
              className="w-full mb-1"
            />
            <div className="text-black">{seqCount} случайного числа</div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="source"
                checked={sourceMode === "range"}
                onChange={() => setSourceMode("range")}
                className="accent-[#cc0000]"
              />
              <span className="link-dashed border-b border-dashed border-black text-black hover:border-solid">из диапазона</span>
            </label>
            <span className="text-gray-500">или</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="source"
                checked={sourceMode === "list"}
                onChange={() => setSourceMode("list")}
                className="accent-[#cc0000]"
              />
              <span className="text-black">из списка</span>
            </label>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span>от</span>
            <input
              type="text"
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              className="input-classic w-16 px-1 py-0.5 rounded-[3px] text-center bg-white focus:outline-none focus:border-gray-500"
            />
            <span>до</span>
            <input
              type="text"
              value={rangeTo}
              onChange={(e) => setRangeTo(e.target.value)}
              className="input-classic w-16 px-1 py-0.5 rounded-[3px] text-center bg-white focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mt-1">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input type="checkbox" className="accent-gray-500" />
              <span className="text-gray-600">исключить числа</span>
            </label>
          </div>

          {error && <div className="alert mt-2 w-full max-w-[520px] mx-auto">{error}</div>}

          <div className="mt-8">
            <a href="#" onClick={(e) => e.preventDefault()} className="link-dashed text-[#cc0000] flex items-center gap-1 justify-center">
              Записать видео генерации
              <i className="fa-solid fa-circle-question text-black text-[10px]"></i>
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-1 items-center">
            <a href="#" onClick={(e) => e.preventDefault()} className="link-dashed text-[#333] font-bold flex items-center gap-1 text-[12px]">
              Приложение в ВК
              <i className="fa-brands fa-vk bg-black text-white rounded-full p-0.5 text-[8px] w-4 h-4 flex items-center justify-center"></i>
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="link-dashed text-[#cc0000] text-[12px]">
              Виджет ГСЧ на сайт
            </a>
          </div>

          {/* (необязательно) history — скрыто, но данные тянем */}
          {!!history.length && (
            <div className="mt-6 text-left w-full max-w-[520px] mx-auto text-[12px] text-gray-700">
              <div className="font-bold mb-1">История:</div>
              <div className="max-h-[140px] overflow-auto bg-white/70 border border-black/10 rounded p-2">
                {history.slice(0, 20).map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-black/5 py-1">
                    <span className="font-bold">{h.value}</span>
                    <span>{h.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="h-12"></div>

      {/* Admin modal */}
      {showAdminModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdminModal(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="font-bold">
                <i className="fa-solid fa-user-gear mr-2"></i> Администрирование
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                style={{ background: "transparent", border: 0, color: "#fff", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {!isAdmin ? (
                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <div className="text-[13px] text-gray-700">Вход в панель администратора</div>
                  <input className="field" placeholder="Логин" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
                  <input className="field" placeholder="Пароль" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                  <button className="small-btn" type="submit" disabled={loading}>
                    {loading ? "..." : "Войти"}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#222]">Панель администратора</div>
                    <button className="danger-btn" type="button" onClick={handleAdminLogout}>Выйти</button>
                  </div>

                  <form onSubmit={handleSetValues} className="space-y-2">
                    <div className="text-[13px] text-gray-700">
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

              {error && <div className="alert mt-3">{error}</div>}
              <div className="text-[12px] text-gray-600 mt-3">
                API: <span className="font-mono">{API_URL || "(не задан)"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}