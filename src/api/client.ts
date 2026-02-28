import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'https://mediflow-backend-z29j.onrender.com'

const client = axios.create({ baseURL })

client.interceptors.request.use((config) => {
  const raw = localStorage.getItem('mediflow_user')
  if (raw) {
    try {
      const user = JSON.parse(raw) as { token?: string }
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    } catch {
      // ignore parse errors
    }
  }
  return config
})

export default client
