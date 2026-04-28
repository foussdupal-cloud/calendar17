import "./globals.css";

export const metadata = {
  title: "Calendar 17",
  description: "Mon planning perso",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}