import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/hrms/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
