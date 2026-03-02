/* === CSS 1:1 из архива (1-screen-1.html) === */

/* Custom Noise Background */
body {
  background-color: #f0f0f0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
  font-family: Arial, Helvetica, sans-serif;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; }
::-webkit-scrollbar-thumb:hover { background: #555; }

/* Header Gradient */
.header-bg {
  background: linear-gradient(to bottom, #3a3a3a 0%, #222222 100%);
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

/* Logo Ribbon Effect */
.logo-ribbon {
  background: linear-gradient(to bottom, #ffcc00 0%, #ffaa00 100%);
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  position: relative;
}
.logo-ribbon::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 5px;
  background: rgba(0,0,0,0.15);
}

/* Button Shadow Effect */
.btn-generate {
  background: linear-gradient(to bottom, #ffcc00 0%, #ffaa00 100%);
  border: 1px solid #a66b00;
  box-shadow: 0 6px 0 #8a5600, 0 10px 15px rgba(0,0,0,0.25);
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}
.btn-generate:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #8a5600, 0 6px 10px rgba(0,0,0,0.22);
}

/* Slider */
input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #bbb;
  border-radius: 3px;
  border: 1px solid #999;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
}

/* Dashed Link */
.link-dashed {
  text-decoration: none;
  border-bottom: 1px dashed #cc0000;
  color: #cc0000;
}
.link-dashed:hover {
  border-bottom: 1px solid #cc0000;
}

/* Input Styling */
.input-classic {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
  border: 1px solid #aaa;
}

/* Menu Item Hover */
.menu-item:hover .menu-icon, .menu-item:hover .menu-text { color: #ffcc00; }
.menu-item.active .menu-icon, .menu-item.active .menu-text { color: #ffcc00; }

/* === ДОБАВЛЕНО: админ-модалка (не ломает пиксель-перфект) === */
.admin-btn {
  color: #ddd;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}
.admin-btn:hover { color: #ffcc00; }

.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 9999;
  padding: 16px;
}
.modal{
  width: 100%;
  max-width: 560px;
  background: #fff;
  border: 1px solid #999;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  border-radius: 8px;
  overflow: hidden;
}
.modal-header{
  background: linear-gradient(to bottom, #3a3a3a 0%, #222222 100%);
  color: #fff;
  padding: 10px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.modal-body{ padding: 14px 12px; }
.field{
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 10px 10px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.12);
}
.small-btn{
  width: 100%;
  background: linear-gradient(to bottom, #ffcc00 0%, #ffaa00 100%);
  border: 1px solid #a66b00;
  padding: 10px 12px;
  border-radius: 6px;
  font-weight: 700;
  color: #222;
  cursor: pointer;
}
.danger-btn{
  background: #d22;
  border: 1px solid #a00;
  color: #fff;
  padding: 7px 10px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.alert{
  border: 1px solid #cc0000;
  background: #fff3f3;
  color: #990000;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
}

/* === ДОБАВЛЕНО: адаптация под телефон (не ломаем десктоп) === */
@media (max-width: 768px) {
  #header-main { height: auto !important; }
  #header-main .max-w-\[980px\] { padding: 0 8px; }

  /* nav уезжает в горизонтальный скролл */
  #header-main nav {
    overflow-x: auto;
    gap: 18px !important;
    padding-right: 6px;
    -webkit-overflow-scrolling: touch;
  }
  #header-main nav::-webkit-scrollbar { height: 6px; }
  #header-main nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 99px; }

  /* цифру поменьше */
  #main-content .text-\[160px\] { font-size: 96px !important; }

  /* кнопка по ширине */
  .btn-generate { width: min(340px, 92vw) !important; }

  /* блоки */
  #main-content { padding-left: 10px; padding-right: 10px; }
}