import React, {useCallback, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Transaction, useTransactions} from './TransactionContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './App.tsx';

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) => {
  const {transactions, balance} = useTransactions();

  const addBeneficiary = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Beneficiary', {
            fromAddFlow: true,
          })
        }>
        <Image
          style={styles.icon}
          tintColor={'#1a8be7'}
          source={{
            uri: 'https://cdn.mservice.com.vn/app/icon/kits/basic_person_tag.png',
          }}
        />
      </TouchableOpacity>
    );
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: addBeneficiary,
    });
  }, [addBeneficiary, navigation]);

  const renderItem = ({item}: ListRenderItemInfo<Transaction>) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Transaction ID: {item.id}</Text>
      <Text style={styles.itemText}>Amount: ${item.amount.toFixed(2)}</Text>
      {item.account && (
        <>
          <Text style={styles.itemText}>To: {item.account.name}</Text>
          <Text style={styles.itemText}>IBAN: {item.account.iban}</Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>
        Current Balance: ${(balance || 0).toFixed(2)}
      </Text>
      <Button
        title="Add Transaction"
        onPress={() => navigation.navigate('Transaction', {})}
      />
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
  listContainer: {
    flexGrow: 1,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default HomeScreen;
