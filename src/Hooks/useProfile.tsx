import axios from "axios"
import { useQuery } from "react-query"
import { useAppDispatch } from "../Store/Store"
import { setIsLogin, setProfile } from "../Store/Slices/authSlice"
import { httpClient } from "../Components/Pages/Utility/HttpClient"

export async function profile() {

    try {
        const refres_token = await httpClient.post("/auth/token")
        if (!refres_token.data) {
            throw new Error
        }

        const response = await httpClient.get('auth/profile', { withCredentials: true })
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