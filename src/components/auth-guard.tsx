import React, { useEffect } from 'react';
import { useNavigate } from 'zmp-ui';
import { useAtomValue, useSetAtom } from 'jotai';
import { isLoggedInAtom, isAuthLoadingAtom, checkAuthActionAtom, userTypeAtom } from '../stores/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const isLoading = useAtomValue(isAuthLoadingAtom);
  const userType = useAtomValue(userTypeAtom);
  const checkAuth = useSetAtom(checkAuthActionAtom);
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ check auth lúc mount component lần đầu
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Nếu chưa load xong thì không làm gì
    if (isLoading) return;

    // Nếu không đăng nhập, đẩy về '/login'
    if (!isLoggedIn) {
      navigate('/login', { replace: true, direction: 'backward' });
      return;
    }

    // Nếu là staff mà truy cập member page → redirect về /staff
    if (userType === 'staff') {
      navigate('/staff', { replace: true, direction: 'forward' });
    }
  }, [isLoading, isLoggedIn, userType, navigate]);

  // Trong lúc đang kiểm tra Auth, hiện Loading cơ bản
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-cream dark:bg-dark-bg text-primary">
        Đang tải dữ liệu...
      </div>
    );
  }

  // Nếu chưa đăng nhập hoặc là staff thì trả về rỗng (redirect sẽ xử lý)
  if (!isLoggedIn || userType === 'staff') {
    return null;
  }

  // Đã đăng nhập là member -> Render trang protected
  return <>{children}</>;
};

export default AuthGuard;

