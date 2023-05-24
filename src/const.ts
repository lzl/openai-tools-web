export const apiBaseUrlServer = 'https://openai-tools-mmxbwgwwaq-uw.a.run.app'

export const apiBaseUrl = import.meta.env.PROD
  ? apiBaseUrlServer
  : 'http://127.0.0.1:5000'

export const maxRows = 300
