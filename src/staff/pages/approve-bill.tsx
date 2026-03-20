// ══════════════════════════════════════════════════════════
// Approve Bill Page — Duyệt Bill (Chỉ Manager)
// ══════════════════════════════════════════════════════════
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Box, Text, Button, Modal, Input, useSnackbar, useNavigate } from 'zmp-ui';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../mock/staff-data';

interface PendingBillAPI {
  id: string;
  posBillCode: string | null;
  amount: number;
  finalAmount: number;
  source: string;
  status: string;
  billImageUrl: string | null;
  staffId: string | null;
  staffName: string;
  memberId: string | null;
  memberName: string;
  memberPhone: string;
  branchId: string;
  createdAt: string;
}

const ApproveBillPage: React.FC = () => {
  const [bills, setBills] = useState<PendingBillAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<PendingBillAPI | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  // Fetch pending bills from API
  const fetchPendingBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/v1/transactions/pending');
      setBills(res.data.data || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể tải danh sách bill.';
      setError(msg);
      console.error('Fetch pending bills error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingBills();
  }, [fetchPendingBills]);

  const openBillDetail = (bill: PendingBillAPI) => {
    setSelectedBill(bill);
    setShowRejectInput(false);
    setRejectReason('');
    setModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedBill) return;
    setProcessing(true);
    try {
      await api.patch(`/api/v1/transactions/${selectedBill.id}/approve`);
      // Remove from local list
      setBills((prev) => prev.filter((b) => b.id !== selectedBill.id));
      setModalVisible(false);
      snackbar.openSnackbar({
        type: 'success',
        text: `Đã phê duyệt bill ${selectedBill.posBillCode || selectedBill.id}!`,
        duration: 2500,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Phê duyệt thất bại.';
      snackbar.openSnackbar({
        type: 'error' as any,
        text: msg,
        duration: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBill || !rejectReason.trim()) return;
    setProcessing(true);
    try {
      await api.patch(`/api/v1/transactions/${selectedBill.id}/reject`, {
        reject_reason: rejectReason.trim(),
      });
      setBills((prev) => prev.filter((b) => b.id !== selectedBill.id));
      setModalVisible(false);
      snackbar.openSnackbar({
        type: 'warning' as any,
        text: `Đã từ chối bill ${selectedBill.posBillCode || selectedBill.id}.`,
        duration: 2500,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Từ chối thất bại.';
      snackbar.openSnackbar({
        type: 'error' as any,
        text: msg,
        duration: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Page className="page bg-cream dark:bg-dark-bg min-h-screen">
      {/* ─── Header ─────────────────────────────────── */}
      <Box className="staff-header px-5 pt-14 pb-7 rounded-b-4xl">
        <Box className="flex items-center gap-3 animate-fade-in">
          <Box
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center cursor-pointer active:bg-white/25 transition-colors"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => navigate('/staff')}
          >
            <Text className="text-white text-lg">←</Text>
          </Box>
          <Box className="flex-1">
            <Text className="text-white font-bold text-lg tracking-tight">
              Duyệt Bill
            </Text>
          </Box>
          {bills.length > 0 && (
            <Box className="bg-white/15 px-3 py-1.5 rounded-xl"
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <Text className="text-white text-sm font-semibold">
                {bills.length} chờ
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* ─── Bill List ──────────────────────────────── */}
      <Box className="px-5 -mt-4 relative z-10">
        {loading ? (
          // Skeleton loading
          <Box className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Box key={i} className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card border border-black/[0.03] dark:border-dark-border animate-pulse">
                <Box className="flex justify-between mb-3">
                  <Box>
                    <Box className="h-4 w-28 bg-gray-200 dark:bg-dark-card rounded mb-2" />
                    <Box className="h-3 w-20 bg-gray-200 dark:bg-dark-card rounded" />
                  </Box>
                  <Box className="h-5 w-16 bg-gray-200 dark:bg-dark-card rounded" />
                </Box>
                <Box className="flex justify-between">
                  <Box className="h-3 w-32 bg-gray-200 dark:bg-dark-card rounded" />
                  <Box className="h-3 w-24 bg-gray-200 dark:bg-dark-card rounded" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : error ? (
          // Error state
          <Box className="bg-white dark:bg-dark-surface rounded-3xl p-10 shadow-card border border-black/[0.03] dark:border-dark-border text-center animate-scale-in">
            <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-error/10 flex items-center justify-center">
              <Text className="text-3xl">⚠️</Text>
            </Box>
            <Text className="font-semibold text-text-main dark:text-dark-text text-base">
              Không thể tải dữ liệu
            </Text>
            <Text className="text-text-muted dark:text-dark-muted text-sm mt-1">
              {error}
            </Text>
            <Button
              size="medium"
              className="!mt-4 !rounded-xl"
              onClick={fetchPendingBills}
            >
              Thử lại
            </Button>
          </Box>
        ) : bills.length === 0 ? (
          // Empty state
          <Box className="bg-white dark:bg-dark-surface rounded-3xl p-10 shadow-card border border-black/[0.03] dark:border-dark-border text-center animate-scale-in">
            <Box className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success-light flex items-center justify-center">
              <Text className="text-3xl">🎉</Text>
            </Box>
            <Text className="font-semibold text-text-main dark:text-dark-text text-base">
              Tất cả đã xử lý!
            </Text>
            <Text className="text-text-muted dark:text-dark-muted text-sm mt-1">
              Không có bill nào chờ duyệt.
            </Text>
          </Box>
        ) : (
          bills.map((bill, index) => (
            <Box
              key={bill.id}
              className="bill-card animate-slide-up"
              style={{ animationDelay: `${index * 0.06}s` }}
              onClick={() => openBillDetail(bill)}
            >
              <Box className="flex justify-between items-start mb-2.5">
                <Box>
                  <Text className="font-semibold text-text-main dark:text-dark-text text-sm">
                    {bill.memberName}
                  </Text>
                  <Text className="text-text-muted dark:text-dark-muted text-xs mt-0.5">
                    {bill.memberPhone || 'Chưa có SĐT'}
                  </Text>
                </Box>
                <Text className="font-bold text-accent text-base">
                  {formatCurrency(Number(bill.amount))}
                </Text>
              </Box>

              <Box className="flex justify-between items-center">
                <Text className="text-xs text-text-muted dark:text-dark-muted">
                  {bill.posBillCode || 'N/A'}
                </Text>
                <Text className="text-xs text-text-muted dark:text-dark-muted">
                  {bill.createdAt ? formatDate(bill.createdAt) : 'N/A'}
                </Text>
              </Box>

              <Box className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-black/[0.04] dark:border-dark-border">
                <Text className="text-xs text-text-muted dark:text-dark-muted">
                  NV: {bill.staffName}
                </Text>
                <Box className="status-badge pending">
                  Chờ duyệt
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* ─── Bill Detail Modal ──────────────────────── */}
      <Modal
        visible={modalVisible}
        title="Chi tiết Bill"
        onClose={() => {
          setModalVisible(false);
          setShowRejectInput(false);
        }}
        actions={[]}
      >
        {selectedBill && (
          <Box className="pb-2">
            {/* Bill Image */}
            {selectedBill.billImageUrl && (
              <Box className="rounded-2xl overflow-hidden mb-4 bg-cream dark:bg-dark-card shadow-inner-soft">
                <img
                  src={selectedBill.billImageUrl}
                  alt="Ảnh bill"
                  className="w-full object-contain"
                  style={{ maxHeight: '220px' }}
                />
              </Box>
            )}

            {/* Bill Info */}
            <Box className="space-y-2 mb-5">
              {[
                { label: 'Khách hàng', value: selectedBill.memberName },
                { label: 'SĐT', value: selectedBill.memberPhone || 'N/A' },
                { label: 'Mã bill', value: selectedBill.posBillCode || 'N/A' },
                { label: 'NV nhập', value: selectedBill.staffName },
                { label: 'Nguồn', value: selectedBill.source === 'staff_manual' ? 'Nhập thủ công' : selectedBill.source },
                { label: 'Thời gian', value: selectedBill.createdAt ? formatDate(selectedBill.createdAt) : 'N/A' },
              ].map((row) => (
                <Box key={row.label} className="flex justify-between py-1">
                  <Text className="text-sm text-text-muted dark:text-dark-muted">{row.label}</Text>
                  <Text className="text-sm font-semibold text-text-main dark:text-dark-text">{row.value}</Text>
                </Box>
              ))}
              <Box className="flex justify-between py-1">
                <Text className="text-sm text-text-muted dark:text-dark-muted">Số tiền</Text>
                <Text className="text-sm font-bold text-accent">
                  {formatCurrency(Number(selectedBill.amount))}
                </Text>
              </Box>
            </Box>

            {/* Reject Input */}
            {showRejectInput && (
              <Box className="mb-4 animate-slide-up">
                <Input
                  type="text"
                  label="Lý do từ chối"
                  placeholder="VD: Ảnh bill không rõ, sai số tiền..."
                  value={rejectReason}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : (e?.target?.value ?? e);
                    setRejectReason(val);
                  }}
                  className="!rounded-xl"
                />
              </Box>
            )}

            {/* Actions */}
            <Box className="flex gap-3">
              {!showRejectInput ? (
                <Button
                  fullWidth
                  size="large"
                  variant="secondary"
                  onClick={() => setShowRejectInput(true)}
                  className="!rounded-xl !font-semibold !border-error/40 !text-error"
                >
                  Từ chối
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="large"
                  loading={processing}
                  disabled={processing || !rejectReason.trim()}
                  onClick={handleReject}
                  className="!rounded-xl !font-semibold !bg-error !text-white !border-error"
                >
                  Xác nhận từ chối
                </Button>
              )}

              {!showRejectInput && (
                <Button
                  fullWidth
                  size="large"
                  loading={processing}
                  disabled={processing}
                  onClick={handleApprove}
                  className="!rounded-xl !font-semibold !bg-success !border-success !text-white"
                >
                  Phê duyệt
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Modal>

      <Box className="h-8" />
    </Page>
  );
};

export default ApproveBillPage;
