import { Button } from '../../components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from 'react-router'

const LogOut = () => {
    const {signOut} = useAuthStore();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div onClick={handleLogOut}>
      Đăng xuất
    </div>
  )
}

export default LogOut;