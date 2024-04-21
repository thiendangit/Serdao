import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import TransactionScreen from './TransactionScreen';
import {TransactionProvider} from './TransactionContext';
import BeneficiaryScreen, {Beneficiary} from './BeneficiaryScreen.tsx';
import AddBeneficiaryScreen from './AddBeneficiaryScreen.tsx';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Transaction: {
    beneficiary?: Beneficiary & {chooseTime: number};
  };
  Beneficiary: {
    fromAddFlow?: boolean;
  };
  AddBeneficiary: undefined;
};

const App = () => {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/*// @ts-ignore*/}
          <Stack.Screen name="Home" component={HomeScreen} />
          {/*// @ts-ignore*/}
          <Stack.Screen name="Transaction" component={TransactionScreen} />
          {/*// @ts-ignore*/}
          <Stack.Screen name="Beneficiary" component={BeneficiaryScreen} />
          <Stack.Screen
            name="AddBeneficiary"
            // @ts-ignore
            component={AddBeneficiaryScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  );
};

export default App;
