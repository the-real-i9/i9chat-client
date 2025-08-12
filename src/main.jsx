import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { Provider } from "react-redux"

import "./index.css"
import store from "./store"

import AppLayout from "./UI/pages/AppLayout.jsx"
import SigninPage from "./UI/pages/SigninPage.jsx"
import ChatsTab from "./UI/tabs/ChatsTab.jsx"
import SignupPage from "./UI/pages/SignupPage.jsx"
import AuthLayout from "./UI/pages/AuthLayout.jsx"
import ChatXView from "./UI/components/ChatXView.jsx"
import AppLoadingUI from "./UI/components/AppLoadingUI.jsx"
import appLoader from "./UI/pages/loaders/appLoader.js"
import ForgotPasswordPage from "./UI/pages/ForgotPasswordPage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    HydrateFallback: AppLoadingUI,
    loader: appLoader,
    children: [
      {
        path: "chats",
        Component: ChatsTab,
        children: [
          {
            path: ":chatId",
            Component: ChatXView,
          },
        ],
      },
    ],
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
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
