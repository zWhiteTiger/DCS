import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { authSelector } from '../Store/Slices/authSlice'
// import Cookies from 'js-cookie';

type Props = {}

export default function PublicRoute({ }: Props) {
    const authReducer = useSelector(authSelector)

    return (
        !authReducer.isLogin ? <Outlet /> : <Navigate to={"/"} />
    )
}