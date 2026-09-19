import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('نام کاربری یا رمز عبور اشتباه است')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-mark">🐓</div>
          <div className="login-title">CRM مرغداری</div>
          <div className="login-sub">سیستم مدیریت مشتریان طیور</div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>نام کاربری</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="نام کاربری را وارد کنید"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>رمز عبور</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ padding: '10px', fontSize: 14, marginTop: 4 }}
            disabled={loading}
          >
            {loading ? 'در حال ورود...' : 'ورود به سیستم'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--t4)', marginTop: 24 }}>
          نسخه ۱.۰.۰
        </p>
      </div>
    </div>
  )
}
