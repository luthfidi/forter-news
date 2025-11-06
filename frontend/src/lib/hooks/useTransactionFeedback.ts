import { useState, useCallback } from 'react';
import type { IndicatorType, IndicatorVariant } from '@/components/shared/FloatingIndicator';

interface FeedbackState {
  show: boolean;
  type: IndicatorType;
  message: string;
  variant?: IndicatorVariant;
  txHash?: string;
}

const DEFAULT_STATE: FeedbackState = {
  show: false,
  type: 'loading',
  message: '',
};

export function useTransactionFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>(DEFAULT_STATE);

  /**
   * Show loading indicator
   */
  const showLoading = useCallback((message: string) => {
    setFeedback({
      show: true,
      type: 'loading',
      message,
    });
  }, []);

  /**
   * Show success indicator
   */
  const showSuccess = useCallback((message: string, txHash?: string, variant?: IndicatorVariant) => {
    setFeedback({
      show: true,
      type: 'success',
      message,
      txHash,
      variant: variant || 'default',
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setFeedback(DEFAULT_STATE);
    }, 5000);
  }, []);

  /**
   * Show error indicator
   */
  const showError = useCallback((message: string) => {
    setFeedback({
      show: true,
      type: 'error',
      message,
      variant: 'destructive',
    });

    // Auto-hide after 6 seconds (longer for errors)
    setTimeout(() => {
      setFeedback(DEFAULT_STATE);
    }, 6000);
  }, []);

  /**
   * Hide feedback
   */
  const hide = useCallback(() => {
    setFeedback(DEFAULT_STATE);
  }, []);

  /**
   * Execute transaction with automatic feedback
   */
  const executeTransaction = useCallback(
    async <T,>(
      transactionFn: () => Promise<{ success: boolean; hash?: string; error?: string; data?: T }>,
      loadingMessage: string,
      successMessage: string,
      variant?: IndicatorVariant
    ): Promise<T | null> => {
      try {
        console.log('[useTransactionFeedback] executeTransaction starting...');
        showLoading(loadingMessage);

        const result = await transactionFn();
        console.log('[useTransactionFeedback] transactionFn result:', result);

        if (result.success) {
          console.log('[useTransactionFeedback] Transaction successful, showing success feedback');
          showSuccess(successMessage, result.hash, variant);

          const returnValue = result.data || (null as T | null);
          console.log('[useTransactionFeedback] Returning from executeTransaction:', returnValue);
          return returnValue;
        } else {
          console.log('[useTransactionFeedback] Transaction failed:', result.error);
          showError(result.error || 'Transaction failed');
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        console.log('[useTransactionFeedback] Exception in executeTransaction:', errorMessage);
        showError(errorMessage);
        return null;
      }
    },
    [showLoading, showSuccess, showError]
  );

  return {
    feedback,
    showLoading,
    showSuccess,
    showError,
    hide,
    executeTransaction,
  };
}
