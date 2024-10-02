import axios from 'axios';
import { useMutation } from 'react-query'
import { Login } from '../Types/auth.type'
// import { useAppDispatch } from '../Store/Store';
// import { setToken } from '../Store/Slices/authSlice';

async function login(email: string, password: string) {
    const response = await axios.post(`${import.meta.env.VITE_URL}/auth/login`,
        {
            email,
            password
        },
        {
            withCredentials: true
        }
    );

    return response.data
}

export function useLogin() {
    // const navigate = useNavigate()
    // const dispatch = useAppDispatch()

    return useMutation<String, String, Login>(
        async ({ email, password }) => await login(email, password), {
        onError: (err) => {
            console.log(err)
        },
        onSuccess: (data) => {
            console.log(data)
        },
    }
    )
}