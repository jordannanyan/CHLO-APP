import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useModalStore } from '../store/modalStore';
import { useAuthStore } from '../store/authStore';
import { transactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/format';

export const CheckoutModal = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    isOpen, selectedPackage, step, phone, phoneError, loading, result,
    closeCheckout, setPhone, setPhoneError, setStep, setLoading, setSuccess, setError,
  } = useModalStore();

  const handleClose = () => {
    if (loading) return;
    closeCheckout();
  };

  const handleProceed = () => {
    if (!phone) { setPhoneError('Nomor telepon wajib diisi'); return; }
    if (!/^08[0-9]{8,11}$/.test(phone)) { setPhoneError('Format tidak valid (contoh: 08123456789)'); return; }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (loading || !selectedPackage || !user) return;
    setLoading(true);
    try {
      const transaction = await transactionService.createTransaction({
        userId: user.id,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        provider: selectedPackage.provider,
        price: selectedPackage.price,
        phone,
        status: 'success',
      });
      setSuccess(transaction);
    } catch {
      setError();
    }
  };

  const handleGoToTransactions = () => {
    closeCheckout();
    navigate('/transactions');
  };

  return (
    <Modal
      isOpen={isOpen && !!selectedPackage}
      onClose={handleClose}
      title={
        step === 'success' ? 'Pembayaran Berhasil!'
        : step === 'confirm' ? 'Konfirmasi Pembelian'
        : 'Beli Paket Data'
      }
      disableBackdropClose={step === 'success' || loading}
      hideCloseButton={step === 'success'}
    >
      {!selectedPackage ? null : (
        <>
          {step === 'form' && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">{selectedPackage.provider}</p>
                <p className="font-semibold text-gray-900">{selectedPackage.name}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{selectedPackage.quota === 999 ? 'Unlimited' : `${selectedPackage.quota}${selectedPackage.quotaUnit}`}</span>
                  <span>·</span>
                  <span>{selectedPackage.validity} hari</span>
                </div>
                <p className="text-lg font-bold text-blue-600 mt-2">{formatCurrency(selectedPackage.price)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    phoneError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                <p className="text-xs text-gray-400 mt-1">Nomor yang akan diisi paket data</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="flex-1" onClick={handleClose}>Batal</Button>
                <Button className="flex-1" onClick={handleProceed}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Paket', value: selectedPackage.name },
                  { label: 'Provider', value: selectedPackage.provider },
                  {
                    label: 'Kuota',
                    value: selectedPackage.quota === 999 ? 'Unlimited' : `${selectedPackage.quota}${selectedPackage.quotaUnit}`,
                  },
                  { label: 'Masa Aktif', value: `${selectedPackage.validity} hari` },
                  { label: 'Nomor', value: phone },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">{formatCurrency(selectedPackage.price)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setStep('form')} disabled={loading}>
                  Kembali
                </Button>
                <Button className="flex-1" onClick={handleConfirm} loading={loading}>
                  {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pembelian Berhasil!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Paket <strong>{selectedPackage.name}</strong> berhasil diaktifkan ke nomor <strong>{phone}</strong>
                </p>
              </div>
              {result && (
                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID Transaksi</span>
                    <span className="font-mono text-xs text-gray-700">{result.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-green-600">{formatCurrency(result.price)}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>Tutup</Button>
                <Button className="flex-1" onClick={handleGoToTransactions}>Lihat Riwayat</Button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};