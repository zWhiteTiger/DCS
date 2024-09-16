import axios from 'axios'
import join from 'url-join'

const NETWORK_CONNECTION_MESSAGE = 'Cannot connect to server, Please try again.'
const NOT_CONNECT_NETWORK = 'NOT_CONNECT_NETWORK'
const isAbsoluteURLRegex = /^(?:\w+:)///

const apiUrl = "http://localhost:4444"

axios.defaults.withCredentials = true
axios.interceptors.request.use(async (config: any) => {
    if (!isAbsoluteURLRegex.test(config.url)) {
        config.url = join(apiUrl, config.url)
    }
    config.timeout = 10000
    return config
})
axios.interceptors.request.use(
    (res) => {
        return res
    },
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error)
        } else if (!error.res) {
            return Promise.reject({
                code: NOT_CONNECT_NETWORK,
                message: NETWORK_CONNECTION_MESSAGE,
            })
        }
        return Promise.reject(error)
    }
)

// axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config
//         // const refreshToken = Cookies.get(cookieKey.refreshToken)

//         if (
//             error.response?.status === 401 &&
//             !originalRequest._retry
//         ) {
//             originalRequest._retry = true

//             try {
//                 await axios.post('auth/refresh/token')

//                 // Retry the original request with the new token
//                 return axios(originalRequest)
//             } catch (refreshError) {
//                 // Handle refresh token error or redirect to login
//                 return Promise.reject(refreshError)
//             }
//         }
//         return Promise.reject(error)
//     }
// )

export const httpClient = axios