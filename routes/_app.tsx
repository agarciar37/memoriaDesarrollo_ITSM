// routes/_app.tsx
import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <title>ITSM – Gestión de incidencias</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="main-bg">
        <Component />
      </body>
    </html>
  );
}
