"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function Page() {
  const [value, setValue] = useState(21);
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState(null);

  const [seqCount, setSeqCount] = useState(1);
  const [sourceMode, setSourceMode] = useState("range");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("100");

  const shown = useMemo(() => String(value ?? 21), [value]);

  useEffect(() => {
    if (!API_URL) return;
    (async () => {
      try {
        const r = await fetch(`${API_URL}/api/active`, { cache: "no-store" });
        const d = await r.json();
        if (typeof d.value !== "undefined") setValue(d.value);
      } catch {}
    })();
  }, []);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_URL) {
        setValue(Math.floor(Math.random() * 100) + 1);
        return;
      }
      const r = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seqCount,
          sourceMode,
          rangeFrom: from,
          rangeTo: to,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || "Ошибка генерации");
      setValue(d.value);
    } catch (e) {
      setError(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <div className="brand">
            <div className="brand__text">RandStuff</div>
          </div>

          <nav className="nav">
            <a className="nav__item nav__item--active" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon">123</span>
              <span className="nav__label">Числа</span>
            </a>

            <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon"><i className="fa-solid fa-trophy"></i></span>
              <span className="nav__label">Определить<br/>победителя</span>
            </a>

            <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon">***</span>
              <span className="nav__label">Пароли</span>
            </a>

            <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon"><i className="fa-solid fa-dharmachakra"></i></span>
              <span className="nav__label">Колесо<br/>фортуны</span>
            </a>

            <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon">???</span>
              <span className="nav__label">Вопросы</span>
            </a>

            <a className="nav__item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="nav__icon"><i className="fa-solid fa-ticket"></i></span>
              <span className="nav__label">Счастливые<br/>билеты</span>
            </a>
          </nav>

<button
  className="admin-btn"
  type="button"
  onClickCapture={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAdmin(true);
  }}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAdmin(true);
  }}
>
            <i className="fa-solid fa-user-gear" style={{ marginRight: 6 }}></i>
            Админ
          </button>
        </div>
      </header>

      <main className="main">
        <div className="title">Случайное число:</div>
        <div className="number">{shown}</div>

        <div className="links">
          <div><a className="link-red" href="#" onClick={(e) => e.preventDefault()}>Проводите розыгрыш во ВКонтакте?</a></div>
          <div><a className="link-red" href="#" onClick={(e) => e.preventDefault()}>Мы поможем определить победителя!</a></div>
        </div>

        <button className="btn-generate" onClick={generate} disabled={loading}>
          {loading ? "..." : "Сгенерировать"}
        </button>

        <div className="controls">
          <div style={{ color: "#666" }}>новую последовательность из</div>
          <input
            className="range"
            type="range"
            min="1"
            max="50"
            value={seqCount}
            onChange={(e) => setSeqCount(parseInt(e.target.value, 10))}
          />
          <div style={{ color: "#111" }}>{seqCount} случайного числа</div>

          <div className="row">
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={sourceMode === "range"} onChange={() => setSourceMode("range")} />
              <span>из диапазона</span>
            </label>
            <span style={{ color: "#888" }}>или</span>
            <label className="row" style={{ gap: 6 }}>
              <input type="radio" checked={sourceMode === "list"} onChange={() => setSourceMode("list")} />
              <span>из списка</span>
            </label>
          </div>

          <div className="row">
            <span>от</span>
            <input className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span>до</span>
            <input className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="checkbox">
            <input type="checkbox" defaultChecked />
            <span>исключить числа</span>
          </div>

          {error && <div className="alert" style={{ maxWidth: 520 }}>{error}</div>}
        </div>
      </main>

      {showAdmin && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdmin(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div style={{ fontWeight: 700 }}>
                <i className="fa-solid fa-user-gear" style={{ marginRight: 8 }}></i>
                Администрирование
              </div>
              <button
                style={{ background: "transparent", border: 0, color: "#fff", cursor: "pointer", fontSize: 18 }}
                onClick={() => setShowAdmin(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>
                (Логин к бекенду включится, когда задашь NEXT_PUBLIC_API_URL)
              </div>
              <input className="field" placeholder="Логин" />
              <div style={{ height: 10 }} />
              <input className="field" placeholder="Пароль" type="password" />
              <div style={{ height: 12 }} />
              <button className="small-btn" type="button">Войти</button>
              <div style={{ marginTop: 10, fontSize: 12, color: "#777" }}>
                API: <span style={{ fontFamily: "monospace" }}>{API_URL || "(не задан)"}</span>
              </div>
            </div>
          </div>
        </div>
        
      )}
    </>
  );
}