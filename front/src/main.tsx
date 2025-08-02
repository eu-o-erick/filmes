import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./style.css";
import "../node_modules/swiper/swiper.css";
import CatalogPage from "./pages/catalog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CatalogPage />,
  },
  {
    path: "/:movieId",
    element: <div>pagina do filme</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
