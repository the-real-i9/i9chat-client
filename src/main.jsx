import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { Provider } from "react-redux"

import "./index.css"
import store from "./store"

import AppLayout from "./UI/pages/AppLayout.jsx"
import LoginPage from "./UI/pages/LoginPage.jsx"
import ChatsTab from "./UI/tabs/ChatsTab.jsx"
import SignupPage from "./UI/pages/SignupPage.jsx"
import AuthLayout from "./UI/pages/AuthLayout.jsx"
import ChatXView from "./UI/components/ChatXView.jsx"
import AppLoadingUI from "./UI/components/AppLoadingUI.jsx"
import appLoader from "./UI/pages/loaders/appLoader.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    hydrateFallbackElement: <AppLoadingUI />,
    loader: appLoader,
    children: [
      {
        path: "chats",
        element: <ChatsTab />,
        children: [
          {
            path: ":chatId",
            element: <ChatXView />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
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
