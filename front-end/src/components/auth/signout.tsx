import { Button } from '../ui/button'
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
    <Button onClick={handleLogOut}>
      Đăng xuất
    </Button>
  )
}

export default LogOut