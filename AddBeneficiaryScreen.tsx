import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Text,
} from 'react-native';
import IBAN from 'iban';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './App.tsx';
import {Beneficiary} from './BeneficiaryScreen.tsx';
import {useTransactions} from './TransactionContext.tsx';

const AddBeneficiaryScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'AddBeneficiary'>) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [iban, setIban] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [ibanError, setIbanError] = useState('');

  const {beneficiaries, addBeneficiaries} = useTransactions();

  useEffect(() => {
    navigation.setOptions({
      title: 'Add beneficiary',
    });
  });

  const isButtonDisabled = !firstName || !lastName || !iban || isLoading;

  const handleAddBeneficiary = async () => {
    if (!firstName || !lastName || !iban) {
      setFirstNameError(!firstName ? 'Please enter first name.' : '');
      setLastNameError(!lastName ? 'Please enter last name.' : '');
      setIbanError(!iban ? 'Please enter IBAN.' : '');
      return;
    }

    if (!IBAN.isValid(iban)) {
      setIbanError('Please enter a valid IBAN.');
      return;
    }

    const isExistIndex = beneficiaries?.findIndex(
      beneficiary => beneficiary.iban === iban,
    );

    if (isExistIndex === -1) {
      setIsLoading(true);

      if (addBeneficiaries) {
        // add beneficiary to local storage
        const newBeneficiaries: Beneficiary = {
          id: Date.now(),
          firstName,
          lastName,
          iban,
        };
        addBeneficiaries(newBeneficiaries);
      }

      setIsLoading(false);
      navigation.goBack();
    } else {
      setIbanError('IBAN is exist, please enter an other one.');
      return;
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container} onTouchStart={dismissKeyboard}>
      <TextInput
        style={[styles.input, !!firstNameError && styles.errorInput]}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />
      {firstNameError ? (
        <Text style={styles.error}>{firstNameError}</Text>
      ) : null}
      <TextInput
        style={[styles.input, !!lastNameError && styles.errorInput]}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />
      {lastNameError ? <Text style={styles.error}>{lastNameError}</Text> : null}
      <TextInput
        style={[styles.input, !!ibanError && styles.errorInput]}
        onChangeText={setIban}
        value={iban}
        multiline
        placeholder="IBAN Ex:GB33BUKB20201555555555,..."
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
          title="Add Beneficiary"
          onPress={handleAddBeneficiary}
          disabled={isButtonDisabled}
        />
      )}
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
    minHeight: 40,
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
});

export default AddBeneficiaryScreen;
