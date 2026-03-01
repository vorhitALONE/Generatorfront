export const metadata = {
  title: "RandStuff — Генератор",
  description: "Generator frontend on Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Tailwind CDN (как в твоём дизайне) */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
