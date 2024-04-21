import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Keyboard} from 'react-native';
import {useTransactions} from './TransactionContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './App.tsx';

const TransactionScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Transaction'>) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const {addTransaction} = useTransactions();

  const handleTransaction = () => {
    const accountDetails = {name, iban};
    if (addTransaction) {
      addTransaction(amount, accountDetails);
    }
    navigation.goBack();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Ẩn bàn phím khi nhấn ra ngoài
  };

  return (
    <View style={styles.container} onTouchStart={dismissKeyboard}>
      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Recipient Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setIban}
        value={iban}
        placeholder="Recipient IBAN"
      />
      <Button title="Submit Transaction" onPress={handleTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    marginVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
});

export default TransactionScreen;
