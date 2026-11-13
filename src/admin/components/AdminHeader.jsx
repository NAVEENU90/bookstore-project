import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("existingUser");
    navigate("/login", { replace: true });
  };

  return (
    <>
     <div className='flex justify-between px-20 p-3'>
      <div className='flex items-center'>
        <img src={logo} alt="Logo" style={{width:'50px', height:"50px"}}/>
        <h1 className='ms-3 font-medium text-2xl'>BOOK STORE</h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className='px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-colors duration-300'
      >
        <FontAwesomeIcon icon={faPowerOff}/>LOGOUT
      </button>
     </div>

     <marquee behavior="" direction="left" className='p-3 bg-gray-900 text-white'>
      <p>Welcome, Admin!... you're all set to manage and monitor the system. Let's get to work</p>
     </marquee>
    </>
  )
}

export default AdminHeader
