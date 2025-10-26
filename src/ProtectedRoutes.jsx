import { Navigate, Outlet, useParams } from 'react-router';

const ProtectedRoutes = () => {
  const { roomId } = useParams();
  const roomIdPattern = /^[a-z]+-[a-z]+$/;

  if (roomId && !roomIdPattern.test(roomId)) {
    return <Navigate to="/error" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
