import axios from "axios"
import { useQuery } from "react-query"
import { useAppDispatch } from "../Store/Store"
import { setIsLogin, setProfile } from "../Store/Slices/authSlice"

export async function profile() {

    try {

        const response = await axios.get('http://localhost:4444/auth/profile', { withCredentials: true })
        return response.data
    } catch (error) {
       throw error
    }
}

export function useProfile() {
    const dispatch = useAppDispatch()

    return useQuery('profile', profile, {
        retry: false,
        onSuccess: (data) => {
            dispatch(setProfile(data))
            dispatch(setIsLogin())
        }
    })
}