import { create } from 'zustand';
import type { Package, Transaction } from '../types';

type CheckoutStep = 'form' | 'confirm' | 'success';

interface ModalState {
  isOpen: boolean;
  selectedPackage: Package | null;
  step: CheckoutStep;
  phone: string;
  phoneError: string;
  loading: boolean;
  result: Transaction | null;
  // actions
  openCheckout: (pkg: Package, defaultPhone?: string) => void;
  closeCheckout: () => void;
  setPhone: (phone: string) => void;
  setPhoneError: (err: string) => void;
  setStep: (step: CheckoutStep) => void;
  setLoading: (loading: boolean) => void;
  setSuccess: (result: Transaction) => void;
  setError: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedPackage: null,
  step: 'form',
  phone: '',
  phoneError: '',
  loading: false,
  result: null,
  openCheckout: (pkg, defaultPhone = '') =>
    set({ isOpen: true, selectedPackage: pkg, step: 'form', phone: defaultPhone, phoneError: '', loading: false, result: null }),
  closeCheckout: () =>
    set({ isOpen: false, selectedPackage: null, step: 'form', phone: '', phoneError: '', loading: false, result: null }),
  setPhone: (phone) => set({ phone, phoneError: '' }),
  setPhoneError: (phoneError) => set({ phoneError }),
  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  setSuccess: (result) => set({ step: 'success', result, loading: false }),
  setError: () => set({ step: 'confirm', loading: false }),
}));
