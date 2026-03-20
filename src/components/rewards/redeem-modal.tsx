import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSnackbar } from 'zmp-ui';
import { useMember, useRedeemItem } from '../../hooks/use-member';

export interface RedeemItemData {
  id: string;
  type: 'reward' | 'discount';
  name: string;
  pointsRequired: number;
}

export const useRedeemModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<RedeemItemData | null>(null);

  const openModal = (data: RedeemItemData) => {
    setItem(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setItem(null);
  };

  return { isOpen, item, openModal, closeModal };
};

interface RedeemModalProps {
  isOpen: boolean;
  item: RedeemItemData | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const RedeemModal: React.FC<RedeemModalProps> = ({ isOpen, item, onClose, onSuccess }) => {
  const { member } = useMember();
  const { redeem } = useRedeemItem();
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !item || !member) return null;

  const isEnoughPoint = member.pointsBalance >= item.pointsRequired;

  const handleConfirm = async () => {
    if (!isEnoughPoint || loading) return;

    setLoading(true);
    try {
      const res = await redeem({ type: item.type, id: item.id });

      openSnackbar({
        text: res.message,
        type: res.success ? 'success' : 'error',
      });

      if (res.success && onSuccess) {
        onSuccess();
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: 'calc(100vw - 48px)',
          maxWidth: 400,
          backgroundColor: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'zoomIn 0.2s ease-out',
        }}
      >
        {/* Content */}
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#1a1a1a' }}>
            Xác nhận đổi thưởng
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, color: '#333' }}>
            {item.name}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#C8956C', marginBottom: 20 }}>
            −{item.pointsRequired} Điểm
          </div>

          {!isEnoughPoint ? (
            <div style={{
              background: '#FEF2F2',
              color: '#DC2626',
              padding: 16,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
            }}>
              Số điểm hiện tại của bạn không đủ.
            </div>
          ) : (
            <div style={{
              background: '#F0FDF4',
              color: '#16A34A',
              padding: 16,
              borderRadius: 12,
              fontSize: 14,
            }}>
              <div style={{ fontWeight: 500 }}>
                Bạn còn {member.pointsBalance.toLocaleString()} điểm.
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
                Voucher sẽ được lưu vào mục "Voucher của tôi"
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #f0f0f0',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              background: 'none',
              fontSize: 15,
              color: '#666',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isEnoughPoint || loading}
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              borderLeft: '1px solid #f0f0f0',
              background: 'none',
              fontSize: 15,
              color: isEnoughPoint && !loading ? '#C8956C' : '#ccc',
              cursor: isEnoughPoint && !loading ? 'pointer' : 'not-allowed',
              fontWeight: 600,
            }}
          >
            {loading ? 'Đang xử lý...' : 'Đổi ngay'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default RedeemModal;
