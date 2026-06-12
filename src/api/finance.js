import http from "./http"

const finance = {
  overview:      (params)   => http.get("/finance/overview/", { params }),
  invoices:      (params)   => http.get("/finance/invoices/", { params }),
  getInvoice:    (id)       => http.get(`/finance/invoices/${id}/`),
  createInvoice: (data)     => http.post("/finance/invoices/", data),
  updateInvoice: (id, data) => http.patch(`/finance/invoices/${id}/`, data),
  deleteInvoice: (id)       => http.delete(`/finance/invoices/${id}/`),
  expenses:      (params)   => http.get("/finance/expenses/", { params }),
  getExpense:    (id)       => http.get(`/finance/expenses/${id}/`),
  createExpense: (data)     => http.post("/finance/expenses/", data),
  updateExpense: (id, data) => http.patch(`/finance/expenses/${id}/`, data),
  deleteExpense: (id)       => http.delete(`/finance/expenses/${id}/`),
}

export default finance
