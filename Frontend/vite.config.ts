import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [basicSsl()],
  server: {
    //https: true,
    https: {
      key: "./ssl/localhost.key",
      cert: "./ssl/localhost.crt",
    },
  },
});
