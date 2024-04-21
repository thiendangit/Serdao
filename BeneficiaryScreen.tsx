import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './App';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from './utils';

export type Beneficiary = {
  id: number;
  lastName: string;
  firstName: string;
  iban: string;
};

type SelectBeneficiaryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Beneficiary'
>;

const SelectBeneficiaryScreen: React.FC<SelectBeneficiaryScreenProps> = ({
  navigation,
  route,
}) => {
  const fromAddFlow = route.params.fromAddFlow;

  const [beneficiaries] = useMMKVStorage<Beneficiary[]>(
    'beneficiaries',
    storage,
    [],
  );

  const addBeneficiary = useCallback(() => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('AddBeneficiary')}>
        <Image
          style={styles.icon}
          tintColor={'#1a8be7'}
          source={{
            uri: 'https://img.mservice.com.vn/momo_app_v2/new_version/img/appx_icon/16_basic_person_add.png',
          }}
        />
      </TouchableOpacity>
    );
  }, [fromAddFlow, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: addBeneficiary,
    });
  }, [addBeneficiary, navigation]);

  useEffect(() => {}, []);

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    // Pass the selected beneficiary back to the AddTransaction screen
    navigation.navigate('Transaction', {
      beneficiary: {...beneficiary, chooseTime: Date.now()},
    } as {beneficiary?: (Beneficiary & {chooseTime: number}) | undefined});
  };

  const renderBeneficiaryItem = ({item}: {item: Beneficiary}) => (
    <TouchableOpacity
      onPress={!fromAddFlow ? () => handleSelectBeneficiary(item) : undefined}
      activeOpacity={!fromAddFlow ? 0 : 0.7}
      style={styles.item}>
      <Text style={styles.itemText}>- First name: {item.firstName}</Text>
      <Text style={styles.itemText}>- Last name: {item.lastName}</Text>
      <Text style={styles.itemText}>- IBAN: {item.iban}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Beneficiary</Text>
      <FlatList
        data={beneficiaries}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderBeneficiaryItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default SelectBeneficiaryScreen;
