"use client";

import { useState } from "react";

export default function Page(){

  const [num,setNum]=useState(0);
  const [admin,setAdmin]=useState(false);

  const generate=()=>{
    setNum(Math.floor(Math.random()*100)+1);
  };

  return(
    <>
      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand">
            <div className="brand-text">RandStuff</div>
          </div>

          <div className="nav">
            <div className="nav-item">123 Числа</div>
            <div className="nav-item">Пароли</div>
            <div className="nav-item">Колесо</div>
            <div className="nav-item">Предсказания</div>
          </div>

          <div className="admin-btn" onClick={()=>setAdmin(true)}>
            Админ
          </div>

        </div>
      </header>

      <main className="main">
        <div className="big-title">Случайное число:</div>
        <div className="big-number">{num}</div>

        <button className="btn" onClick={generate}>
          Сгенерировать
        </button>
      </main>

      {admin && (
        <div className="modal-bg" onClick={()=>setAdmin(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>Админ панель</h3>
            <p>Подключение backend дальше</p>
          </div>
        </div>
      )}
    </>
  );
}