export const metadata = {
  title: "RandStuff — Генератор",
};

const CSS = `
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:Arial,Helvetica,sans-serif;
  background:
    radial-gradient(circle at 50% 22%, #ffffff 0%, #f2f2f2 45%, #e2e2e2 100%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.10'/%3E%3C/svg%3E");
}

/* HEADER */
.header{
  height:58px;
  background:
    linear-gradient(#4b4b4b,#242424),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
  background-blend-mode:overlay;
  box-shadow:0 2px 8px rgba(0,0,0,.35);
  border-bottom:1px solid rgba(0,0,0,.55);
}
.header__inner{
  max-width:1000px;
  margin:0 auto;
  height:100%;
  display:flex;
  align-items:center;
  gap:14px;
  padding:0 10px;
}

/* BRAND */
.brand{
  width:124px;
  height:74px;
  margin-top:-16px;
  background:linear-gradient(#ffd84a,#ffb100);
  border:1px solid #b87900;
  border-top:0;
  border-radius:0 0 6px 6px;
  box-shadow:0 3px 0 rgba(0,0,0,.35);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
}
.brand__text{
  font-family:"Lobster",cursive;
  font-size:30px;
  color:#121212;
  transform:rotate(-2deg);
  user-select:none;
}

/* NAV */
.nav{
  display:flex;
  align-items:flex-start;
  gap:22px;
  flex:1;
  min-width:0;
}
.nav__item{
  width:72px;
  text-align:center;
  color:#d8d8d8;
  text-decoration:none;
  user-select:none;
}
.nav__icon{
  display:block;
  font-size:18px;
  margin-bottom:6px;
  color:#d8d8d8;
}
.nav__label{
  display:block;
  font-size:11px;
  line-height:12px;
}
.nav__item:hover .nav__icon,
.nav__item:hover .nav__label{color:#ffcc00}
.nav__item--active .nav__icon,
.nav__item--active .nav__label{color:#ffcc00}

/* ADMIN */
.admin-btn{
  border:0;
  background:transparent;
  color:#eaeaea;
  font-size:12px;
  cursor:pointer;
  padding:6px 10px;
  border-radius:6px;
  white-space:nowrap;
}
.admin-btn:hover{color:#ffcc00}

/* MAIN */
.main{
  max-width:1000px;
  margin:0 auto;
  padding:44px 12px 80px;
  text-align:center;
}
.title{font-size:30px;color:#111;margin:18px 0 10px}
.number{font-size:160px;line-height:1;font-weight:500;color:#000;margin:0 0 12px}

.links{font-size:13px;margin:6px 0 18px}
.link-red{
  color:#cc0000;
  text-decoration:none;
  border-bottom:1px dashed #cc0000;
}
.link-red:hover{border-bottom-style:solid}

/* BUTTON */
.btn-generate{
  width:340px;
  display:inline-block;
  padding:14px 18px;
  font-size:34px;
  font-weight:700;
  font-family:"Lobster",cursive;
  color:#161616;
  cursor:pointer;
  background:linear-gradient(#ffd84a,#ffb100);
  border:1px solid #b87900;
  border-radius:7px;
  box-shadow:0 7px 0 #8a5600,0 12px 20px rgba(0,0,0,.25);
  text-shadow:0 1px 0 rgba(255,255,255,.7);
}
.btn-generate:active{
  transform:translateY(4px);
  box-shadow:0 3px 0 #8a5600,0 8px 14px rgba(0,0,0,.22);
}
.btn-generate:disabled{opacity:.65;cursor:not-allowed}

/* CONTROLS */
.controls{
  margin-top:18px;
  font-size:13px;
  color:#333;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
}
.range{width:280px}
.row{display:flex;align-items:center;gap:10px}
.input{
  width:72px;
  border:1px solid #c1c1c1;
  border-radius:3px;
  padding:2px 6px;
  background:#fff;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.12);
  text-align:center;
}
.checkbox{display:flex;align-items:center;gap:8px;color:#555}

/* MODAL */
.modal-backdrop{
  position:fixed;inset:0;
  background:rgba(0,0,0,.45);
  display:flex;align-items:center;justify-content:center;
  z-index:9999;padding:16px;
}
.modal{
  width:100%;max-width:560px;
  background:#fff;border:1px solid #999;
  box-shadow:0 12px 40px rgba(0,0,0,.35);
  border-radius:8px;overflow:hidden;
}
.modal__header{
  background:linear-gradient(#4b4b4b,#242424);
  color:#fff;padding:10px 12px;
  display:flex;align-items:center;justify-content:space-between;
}
.modal__body{padding:14px 12px}
.field{
  width:100%;
  border:1px solid #aaa;border-radius:4px;
  padding:10px;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.12);
}
.small-btn{
  width:100%;
  background:linear-gradient(#ffd84a,#ffb100);
  border:1px solid #b87900;
  padding:10px 12px;border-radius:6px;
  font-weight:700;color:#222;cursor:pointer;
}
.alert{
  border:1px solid #cc0000;
  background:#fff3f3;color:#990000;
  padding:8px 10px;border-radius:6px;
  font-size:13px;margin-top:10px;
}

/* MOBILE */
@media (max-width:768px){
  .header__inner{padding:0 8px;gap:10px}
  .brand{width:104px;height:66px;margin-top:-12px}
  .brand__text{font-size:26px}

  .nav{
    overflow-x:auto;overflow-y:hidden;
    -webkit-overflow-scrolling:touch;
    gap:14px;padding-bottom:2px;
  }
  .nav::-webkit-scrollbar{height:6px}
  .nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.25);border-radius:99px}
  .nav__item{width:62px;flex:0 0 auto}
  .nav__icon{font-size:16px;margin-bottom:4px}
  .nav__label{font-size:10px;line-height:11px}

  .main{padding:26px 10px 60px}
  .title{font-size:22px}
  .number{font-size:96px}
  .btn-generate{width:min(340px,92vw);font-size:28px}
  .range{width:240px}
}
@media (max-width:420px){
  .number{font-size:86px}
  .btn-generate{font-size:26px}
}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}