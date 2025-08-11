import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Provider } from 'react-redux'


import './index.css'
import App from './UI/pages/App.jsx'
import store from './store'
import LoginPage from './UI/pages/LoginPage.jsx'
import ChatsTab from './UI/tabs/Chats.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        path: "chat",
        element: <ChatsTab />,
        children: [
          {
            path: ":chat_id",
          }
        ]
      },
    ]
  },
  {
    path: "login",
    element: <LoginPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />,
    </Provider>
  </StrictMode>
)
