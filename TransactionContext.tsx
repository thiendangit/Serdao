import React, {createContext, useContext} from 'react';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from './utils';
import {Beneficiary} from './BeneficiaryScreen.tsx';

export type Account = {name: string; iban: string};
export type Transaction = {
  id: number;
  amount: number;
  account: Account;
};

export type TransactionContextType = {
  transactions?: Transaction[];
  addTransaction?: (amount: string, account: Account) => void;
  balance?: number;
  beneficiaries?: Beneficiary[];
  addBeneficiaries?: (beneficiary: Beneficiary) => void;
};

const TransactionContext = createContext<TransactionContextType>({});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({children}: React.PropsWithChildren) => {
  const [transactions, setTransactions] = useMMKVStorage<Transaction[]>(
    'transactionList',
    storage,
    [],
  );
  const [beneficiaries, setBeneficiaries] = useMMKVStorage<Beneficiary[]>(
    'beneficiaries',
    storage,
    [],
  );
  const [balance, setBalance] = useMMKVStorage<number>('balance', storage, 0);

  const addTransaction = (amount: string, account: Account) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      account,
    };

    setTransactions((prevTransactions: Transaction[]) => [
      ...prevTransactions,
      newTransaction,
    ]);

    setBalance((prevBalance: number) => prevBalance - parseFloat(amount));
  };

  const addBeneficiaries = (beneficiary: Beneficiary) => {
    setBeneficiaries((prevBeneficiaries: Beneficiary[]) => [
      ...prevBeneficiaries,
      beneficiary,
    ]);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        balance,
        beneficiaries,
        addBeneficiaries,
      }}>
      {children}
    </TransactionContext.Provider>
  );
};
