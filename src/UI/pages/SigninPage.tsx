import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { appAxios } from "../../utils/utils"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/userSlice"

export default function SigninPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!identifier || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const resp = await appAxios.post("/auth/signin", {
        emailOrUsername: identifier,
        password,
      })

      console.log(resp)

      dispatch(setUser(resp.data.user))
      navigate("/", { replace: true })
    } catch (error: any) {
      if (error.status == 404) setError(error.response.data)
      else { console.error(error); setError('dev: debug') }
      setLoading(false)
    }
  }

  return (
    <div className="signin-page h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to i9chat</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium mb-1"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
