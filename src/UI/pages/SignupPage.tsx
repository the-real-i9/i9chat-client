import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/userSlice"
import { appAxios } from "../../utils/utils"

export default function SignupPage() {
  const [stage, setStage] = useState(1) // 1: email, 2: verify code, 3: set credentials

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  /**
   * @param {Event} e 
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await appAxios.post("/auth/signup/request_new_account", { email })
      setStage(2)
    } catch (error) {
      if (error.status === 409) setError(error.response.data)
      else {
        console.error(error)
        setError("dev: debug")
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * @param {Event} e 
   */
  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    if (!code) {
      setError("Please enter the verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await appAxios.post("/auth/signup/verify_email", { code })
      setStage(3)
    } catch (error) {
      if (error.status === 400) setError(error.response.data)
      else {
        console.error(error)
        setError("dev: debug")
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * @param {Event} e 
   */
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const resp = await appAxios.post("/auth/signup/register_user", {
        username,
        password,
      })

      console.log(resp)

      dispatch(setUser(resp.data.user))
      navigate("/", { replace: true })
    } catch (error) {
      if (error.status === 409) {
        setError(error.response.data)
      } else {
        console.error(error)
        setError("dev: debug")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderStage1 = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Join i9chat</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email address to get started.
      </p>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </button>
      </form>
    </div>
  )

  const renderStage2 = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        We've sent a verification code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleCodeSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>

        <button
          type="button"
          onClick={() => setStage(1)}
          className="w-full p-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          disabled={isLoading}
        >
          Back to Email
        </button>
      </form>
    </div>
  )

  const renderStage3 = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Account
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Choose your username and password.
      </p>

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Enter password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  )

  return (
    <div className="signup-page h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        {error && (
          <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {stage === 1 && renderStage1()}
        {stage === 2 && renderStage2()}
        {stage === 3 && renderStage3()}

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
