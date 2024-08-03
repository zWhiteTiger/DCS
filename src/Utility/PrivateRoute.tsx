import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router'
import { authSelector } from '../Store/Slices/authSlice';
import Cookies from 'js-cookie';

type Props = {}

export default function PrivateRoute({ }: Props) {
    const authReducer = useSelector(authSelector)
    return (
        authReducer.isLogin ? <Outlet /> : <Navigate to={"/auth/login"} />
    )
}