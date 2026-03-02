import "./globals.css";

export const metadata = {
  title: "RandStuff - Генератор случайных чисел",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Tailwind CDN как в исходном html */}
        <script src="https://cdn.tailwindcss.com"></script>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Times+New+Roman&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}