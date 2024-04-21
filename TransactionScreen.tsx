import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTransactions} from './TransactionContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './App.tsx';
import IBAN from 'iban';

const TransactionScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Transaction'>) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [iban, setIban] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ibanError, setIbanError] = useState('');
  const [amountError, setAmountError] = useState('');
  const {addTransaction} = useTransactions();

  const handleTransaction = async () => {
    const amountValue = parseFloat(amount);

    if (!amountValue || isNaN(amountValue)) {
      setAmountError('Please enter a valid amount.');
      return;
    }

    if (!name || !iban) {
      setIbanError('');
      alertUser('Please fill in all fields before submitting the transaction.');
      return;
    }

    if (!IBAN.isValid(iban)) {
      setIbanError('Please enter a valid IBAN.');
      return;
    }

    setIsLoading(true);

    const accountDetails = {name, iban};
    try {
      if (addTransaction) {
        await addTransaction(amountValue?.toString(), accountDetails);
      }
      navigation.goBack();
    } catch (error) {
      alertUser(
        'An error occurred while processing the transaction. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const alertUser = (message: React.SetStateAction<string>) => {
    setIbanError(message);
    setTimeout(() => {
      setIbanError('');
    }, 3000);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isButtonDisabled = !amount || !name || !iban || isLoading;

  return (
    <View style={styles.container} onTouchStart={dismissKeyboard}>
      <TouchableOpacity
        style={styles.beneficiaryButton}
        onPress={() => navigation.navigate('Beneficiary', {})}>
        <Image
          source={{
            uri: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/24_gadgets_soft_disk.png',
          }}
          tintColor={'#007bff'}
          style={styles.icon}
        />
        <Text style={styles.beneficiaryText}>Saved beneficiary</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <TextInput
          style={[styles.input, !!amountError && styles.errorInput]}
          onChangeText={text => {
            const newValue = parseFloat(text);
            if (text || !isNaN(newValue)) {
              setAmount(newValue?.toString());
            } else {
              setAmount('0');
            }
          }}
          value={amount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />
        {amountError ? <Text style={styles.error}>{amountError}</Text> : null}
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Recipient Name"
        />
        <TextInput
          style={[styles.input, !!ibanError && styles.errorInput]}
          onChangeText={text => {
            setIban(text);
            setIbanError(''); // Reset error message when user edits IBAN
          }}
          value={iban}
          placeholder="Recipient IBAN"
        />
        {ibanError ? <Text style={styles.error}>{ibanError}</Text> : null}
        {isLoading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#0000ff"
          />
        ) : (
          <Button
            title="Submit Transaction"
            onPress={handleTransaction}
            disabled={isButtonDisabled}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  content: {
    alignItems: 'center',
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
  loading: {
    marginVertical: 16,
  },
  error: {
    color: 'red',
    marginVertical: 8,
  },
  errorInput: {
    borderColor: 'red',
  },
  beneficiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
    marginRight: 45,
  },
  beneficiaryText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007bff',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default TransactionScreen;
