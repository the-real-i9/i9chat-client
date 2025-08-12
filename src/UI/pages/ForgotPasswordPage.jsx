import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { appAxios } from "../../utils/utils"

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState(1) // 1: email, 2: confirmation code, 3: new password

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
      await appAxios.post("/auth/forgot_password/request_password_reset", {
        email,
      })
      setStage(2)
    } catch (error) {
      if (error.status === 404) setError(error.response.data)
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
    if (!token) {
      setError("Please enter the confrmation token")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await appAxios.post("/auth/forgot_password/confirm_email", { token })
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
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmNewPassword) {
      setError("Please fill in both password fields")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const resp = await appAxios.post("/auth/forgot_password/reset_password", {
        newPassword,
        confirmNewPassword,
      })

      // Redirect to signin with success message
      navigate("/signin", {
        state: { message: resp.data.msg },
      })
    } catch (error) {
      console.error(error)
      setError("dev: debug")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStage1 = () => (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you a verification code.
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
      <h1 className="text-2xl font-bold mb-6 text-center">
        Enter Verification Code
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        We've sent a verification code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleCodeSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium mb-1">
            Verification Token
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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
          {isLoading ? "Verifying..." : "Verify Token"}
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
      <h1 className="text-2xl font-bold mb-6 text-center">Set New Password</h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Enter your new password below.
      </p>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  )

  return (
    <div className="forgot-password-page h-screen flex justify-center items-center">
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
          Remember your password?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
