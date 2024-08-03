import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from './Slices/authSlice'

const reducer = {
    authReducer
}


export const store = configureStore({
    reducer,
    devTools: import.meta.env.NODE_ENV === "development",
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();