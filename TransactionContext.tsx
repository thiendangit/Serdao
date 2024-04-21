import React, {createContext, useContext} from 'react';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from './utils';

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
};

const TransactionContext = createContext<TransactionContextType>({});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({children}: React.PropsWithChildren) => {
  const [transactions, setTransactions] = useMMKVStorage<any[]>(
    'TransactionList',
    storage,
    [],
  );

  const [balance, setBalance] = useMMKVStorage('Balance', storage, 0);

  const addTransaction = (amount: string, account: Account) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      account,
    };
    setTransactions((prevTransactions: any) => [
      ...prevTransactions,
      newTransaction,
    ]);
    setBalance(prevBalance => prevBalance - parseFloat(amount));

    setTransactions(prevValue => {
      return [...prevValue, newTransaction];
    });
  };

  return (
    <TransactionContext.Provider
      value={{transactions, addTransaction, balance}}>
      {children}
    </TransactionContext.Provider>
  );
};
