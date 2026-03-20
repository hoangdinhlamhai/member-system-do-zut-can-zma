// ══════════════════════════════════════════════════════════
// Staff Auth Store (Jotai) - Dùng data từ API thật
// ══════════════════════════════════════════════════════════
import { atom } from 'jotai';
import { staffAtom, StaffInfo } from '../../stores/auth';

// Staff user hiện tại - derived từ global staffAtom (đã được fill từ API /auth/me)
export const staffUserAtom = atom<StaffInfo | null>((get) => get(staffAtom));

// Trạng thái đăng nhập
export const isStaffLoggedInAtom = atom((get) => get(staffUserAtom) !== null);

// Check role
export const isStoreManagerAtom = atom(
  (get) => {
    const role = get(staffUserAtom)?.role;
    return role === 'store_manager' || role === 'manager';
  }
);
