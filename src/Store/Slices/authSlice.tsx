import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";

type Profile = {
    email: string
    firstName: string
    lastName: string
    _id: string
}

type AuthState = {
    result: Profile | undefined
    isLogin: boolean
}

const initialState: AuthState = {
    result: undefined,
    isLogin: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setProfile: (state: AuthState, actions: PayloadAction<Profile>) => {
            state.result = actions.payload
        },
        setIsLogin: (state: AuthState) => {
            state.isLogin = true
        },
    }
})

export const { setProfile, setIsLogin } = authSlice.actions
export const authSelector = (store: RootState) => store.authReducer
export default authSlice.reducer