export async function postData(url = '', data, method) {
  const options = {
    method,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    redirect: 'follow', // manual, *follow, error
  }

  // Solo incluir body si el método no es GET y se proporcionan datos
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(url, options)
  return response.json()
}
