import "./globals.css";

export const metadata = {
  title: "RandStuff — Генератор",
  description: "RandStuff clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}