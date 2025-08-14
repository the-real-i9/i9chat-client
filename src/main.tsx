import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import { Provider } from "react-redux"

import "./index.css"
import store from "./store/index"

import AppLayout from "./UI/pages/AppLayout.tsx"
import SigninPage from "./UI/pages/SigninPage.tsx"
import ChatsTab from "./UI/tabs/ChatsTab.tsx"
import SignupPage from "./UI/pages/SignupPage.tsx"
import AuthLayout from "./UI/pages/AuthLayout.tsx"
import ChatXView from "./UI/components/ChatXView.tsx"
import AppLoadingUI from "./UI/components/AppLoadingUI.tsx"
import appLoader from "./UI/pages/loaders/appLoader.ts"
import ForgotPasswordPage from "./UI/pages/ForgotPasswordPage.tsx"
import MomentsTab from "./UI/tabs/MomentsTab.tsx"
import CallsTab from "./UI/tabs/CallsTab.tsx"
import FriendsTab from "./UI/tabs/FriendsTab.tsx"
import chatLoader from "./UI/pages/loaders/chatLoader.ts"

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
            path: ":chatIdent",
            loader: chatLoader,
            Component: ChatXView,
          },
        ],
      },
      {
        path: "moments",
        Component: MomentsTab,
      },
      {
        path: "calls",
        Component: CallsTab,
      },
      {
        path: "friends",
        Component: FriendsTab,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
