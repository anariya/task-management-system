import {Outlet} from "react-router-dom"
import {useState, useEffect} from "react"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setisLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth } = useAuth
}
