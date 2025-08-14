import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="auth-layout h-screen flex justify-center items-center">
      <Outlet />
    </div>
  )
}
