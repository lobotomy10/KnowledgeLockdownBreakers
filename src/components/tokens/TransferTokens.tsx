import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { tokenAPI } from '../../services/api';

interface TransferTokensProps {
  onClose?: () => void;
  onTransfer?: () => void;
}

export default function TransferTokens({ onClose, onTransfer }: TransferTokensProps) {
  const { t } = useTranslation();
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    try {
      setError('');
      const numAmount = parseInt(amount, 10);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError(t('tokens.invalidAmount'));
        return;
      }

      await tokenAPI.transfer(toUserId, numAmount);
      alert(t('tokens.transferSuccess', { amount: numAmount }));
      if (onTransfer) {
        onTransfer();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      setError(t('tokens.transferFailed'));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">{t('tokens.transfer')}</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleTransfer();
        }} className="space-y-4">
          <div>
            <Label htmlFor="toUserId">{t('tokens.recipientId')}</Label>
            <Input
              id="toUserId"
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              placeholder={t('tokens.enterRecipientId')}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">{t('tokens.amount')}</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('tokens.enterAmount')}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('tokens.transfer')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
