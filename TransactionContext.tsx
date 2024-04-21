import React, {createContext, useState, useContext} from 'react';

type Account = {name: string; iban: string};

type TransactionContextType = {
  transactions?: any[];
  addTransaction?: (amount: string, account: Account) => void;
  balance: number;
};

const TransactionContext = createContext<TransactionContextType>({
  balance: 1000,
});

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({children}: React.PropsWithChildren) => {
  const [transactions, setTransactions] = useState<any>([]);
  const [balance, setBalance] = useState(1000);

  const addTransaction = (amount: string, account: Account) => {
    const newTransaction = {
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
