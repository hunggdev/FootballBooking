import LogOut from '@/components/auth/signout'
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@base-ui/react/button';
import { toast } from 'sonner';
const HomePage = () => {

  const user = useAuthStore((s) => s.user);
  const handleOnClick = async () => {
    try {
      await api.get("/users/test", {withCredentials : true});
      toast.success("ok");
    } catch (error) {
      toast.error("thất bại");
      console.error(error);
    }
  }
  return (
    <div>
      {user?.fullName}
      <LogOut />
      <Button className='border border-solid' onClick={handleOnClick}>test</Button>
    </div>
    
  )
}

export default HomePage