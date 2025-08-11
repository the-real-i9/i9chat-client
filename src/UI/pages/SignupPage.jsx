import { useState } from "react";
import { useDispatch } from "react-redux";

export default function SignupPage() {

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    rememberMe: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="signup-page h-screen flex justify-center items-center">
      <div className="p-10 text-2xl">Home Feed</div>
    </div>
  )
}
