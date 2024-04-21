import React, {createContext, useState, useContext} from 'react';

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
  const [transactions, setTransactions] = useState<any>([]);
  const [balance, setBalance] = useState(0);

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
  };

  return (
    <TransactionContext.Provider
      value={{transactions, addTransaction, balance}}>
      {children}
    </TransactionContext.Provider>
  );
};
