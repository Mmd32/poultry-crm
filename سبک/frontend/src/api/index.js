import api from './axios'

export const auth = {
  login: (data) => api.post('/auth/token/', data),
  me: () => api.get('/accounts/me/'),
}

export const customers = {
  list: (params) => api.get('/customers/', { params }),
  get: (id) => api.get(`/customers/${id}/`),
  create: (data) => api.post('/customers/', data),
  update: (id, data) => api.patch(`/customers/${id}/`, data),
  delete: (id) => api.delete(`/customers/${id}/`),
}

export const farms = {
  list: (params) => api.get('/farms/', { params }),
  get: (id) => api.get(`/farms/${id}/`),
  create: (data) => api.post('/farms/', data),
  update: (id, data) => api.patch(`/farms/${id}/`, data),
}

export const sales = {
  list: (params) => api.get('/sales/', { params }),
  create: (data) => api.post('/sales/', data),
  update: (id, data) => api.patch(`/sales/${id}/`, data),
}

export const feedbacks = {
  list: (params) => api.get('/feedbacks/', { params }),
  create: (data) => api.post('/feedbacks/', data),
}

export const reminders = {
  list: (params) => api.get('/reminders/', { params }),
  create: (data) => api.post('/reminders/', data),
  update: (id, data) => api.patch(`/reminders/${id}/`, data),
  markDone: (id) => api.post(`/reminders/${id}/done/`),
  stats: () => api.get('/reminders/stats/dashboard/'),
}

export const churn = {
  list: (params) => api.get('/churn/', { params }),
  create: (data) => api.post('/churn/', data),
}

export const offers = {
  list: (params) => api.get('/offers/', { params }),
  create: (data) => api.post('/offers/', data),
  update: (id, data) => api.patch(`/offers/${id}/`, data),
}
