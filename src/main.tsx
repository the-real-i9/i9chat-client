import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";

import "./index.css";
import store from "./store/index";
import AppLayout from "./UI/pages/AppLayout";
import SigninPage from "./UI/pages/SigninPage";
import SignupPage from "./UI/pages/SignupPage.tsx";
import AuthLayout from "./UI/pages/AuthLayout.tsx";
import AppLoadingUI from "./UI/components/AppLoadingUI.tsx";
import appLoader from "./UI/pages/loaders/appLoader.ts";
import ForgotPasswordPage from "./UI/pages/ForgotPasswordPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    HydrateFallback: AppLoadingUI,
    loader: appLoader,
    shouldRevalidate: ({ nextUrl }) => {
      return nextUrl.pathname === "/";
    },
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: "signin",
        Component: SigninPage,
      },
      {
        path: "forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
