import { atom } from 'jotai';
import { api } from '../services/api';

// Định nghĩa types
export interface MemberInfo {
  id: string;
  zaloId?: string;
  zaloName?: string;
  zaloAvatar?: string;
  phone?: string;
  points: number;
}

export interface StaffInfo {
  id: string;
  phone: string;
  fullName: string;
  role: string;
  branchId?: string;
  branchName?: string | null;
  branchAddress?: string | null;
}

// Lấy token trực tiếp từ localStorage khi khởi tạo atom
const initialToken = localStorage.getItem('accessToken') || null;
const initialUserType = localStorage.getItem('userType') as 'member' | 'staff' | null;

// Atoms
export const tokenAtom = atom<string | null>(initialToken);
export const memberAtom = atom<MemberInfo | null>(null);
export const staffAtom = atom<StaffInfo | null>(null);
export const userTypeAtom = atom<'member' | 'staff' | null>(initialUserType);
export const isLoggedInAtom = atom((get) => !!get(tokenAtom) && (!!get(memberAtom) || !!get(staffAtom)));
export const isAuthLoadingAtom = atom<boolean>(true);

// --- Actions (Derived atoms cho logic) ---

/**
 * Logic thực hiện Phone Login
 * Backend sẽ trả về userType: 'member' | 'staff'
 * FE dựa vào đó để redirect đúng UI
 */
export const phoneLoginActionAtom = atom(
  null,
  async (get, set, { phone, refCode }: { phone: string; refCode?: string }) => {
    try {
      const response = await api.post('/auth/phone-login', {
        phone,
        refCode,
      });

      const data = response.data;
      
      // Lưu token + userType vào localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userType', data.userType);
      
      // Cập nhật State
      set(tokenAtom, data.accessToken);
      set(userTypeAtom, data.userType);

      if (data.userType === 'staff') {
        set(staffAtom, data.staff);
        set(memberAtom, null);
      } else {
        set(memberAtom, data.member);
        set(staffAtom, null);
      }
      
      return data; // { accessToken, userType, member?, staff?, isNewUser }
    } catch (error) {
      console.error('Lỗi khi đăng nhập bằng SĐT:', error);
      throw error;
    }
  }
);

/**
 * Logic kiểm tra xem token còn hợp lệ không (gọi khi vào app)
 * /auth/me trả về user info bao gồm userType
 */
export const checkAuthActionAtom = atom(
  null,
  async (get, set) => {
    const currentToken = get(tokenAtom);
    
    if (!currentToken) {
      set(isAuthLoadingAtom, false);
      return false;
    }

    try {
      set(isAuthLoadingAtom, true);
      const response = await api.get('/auth/me');
      const userData = response.data;

      if (userData.userType === 'staff') {
        set(userTypeAtom, 'staff');
        set(staffAtom, userData);
        set(memberAtom, null);
        localStorage.setItem('userType', 'staff');
      } else {
        set(userTypeAtom, 'member');
        set(memberAtom, userData);
        set(staffAtom, null);
        localStorage.setItem('userType', 'member');
      }
      
      return true;
    } catch (error) {
      console.error('Lỗi verify token:', error);
      // Xóa token nếu lỗi 401
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      set(tokenAtom, null);
      set(memberAtom, null);
      set(staffAtom, null);
      set(userTypeAtom, null);
      return false;
    } finally {
      set(isAuthLoadingAtom, false);
    }
  }
);

/**
 * Hàm logout
 */
export const logoutActionAtom = atom(
  null,
  (get, set) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userType');
    set(tokenAtom, null);
    set(memberAtom, null);
    set(staffAtom, null);
    set(userTypeAtom, null);
  }
);
