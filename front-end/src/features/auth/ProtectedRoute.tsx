import {useAuthStore} from '@/stores/useAuthStore'
import { useEffect, useState } from 'react';
import {Navigate, Outlet} from 'react-router'

const ProtectedRoute = () => {
    const {accessToken, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if(!accessToken){ 
            await refresh();
        }

        // đọc lại state MỚI sau khi refresh() hoàn thành (tránh race condition)
        const freshToken = useAuthStore.getState().accessToken;
        if(freshToken && !useAuthStore.getState().user){
            await fetchMe();
        }

        setStarting(false);
    };

    useEffect(() => {
        init()
    }, [])

    if(loading || starting){
        return <div className='flex h-screen items-center justify-center'>Đang tải trang ...</div>
    }

    if(!accessToken){
        return (
            <Navigate
                to="/signin"
                replace
            />
        )
    }
    
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute