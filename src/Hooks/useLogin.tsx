import { Password } from '@mui/icons-material';
import axios from 'axios';
import { useMutation } from 'react-query'
import { Login } from '../Types/auth.type'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../Store/store';
// import { setToken } from '../Store/Slices/authSlice';

async function login(email: string, password: string) {
    const response = await axios.post('http://localhost:4444/auth/login',
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
    const dispatch = useAppDispatch()

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