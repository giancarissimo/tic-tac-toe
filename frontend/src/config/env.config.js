const envconfig = {
  socket_url: import.meta.env.VITE_SOCKET_URL,
  api_login: import.meta.env.VITE_API_LOGIN,
  api_register: import.meta.env.VITE_API_REGISTER,
  api_logout: import.meta.env.VITE_API_LOGOUT,
  api_validate_session: import.meta.env.VITE_API_VALIDATE_SESSION,
}

export default envconfig
