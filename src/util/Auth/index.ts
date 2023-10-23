import AsyncStorage from '@react-native-async-storage/async-storage';
// import OneSignal from 'react-native-onesignal';

export async function setOperatorInAsyncStorage(operator) {
  await AsyncStorage.setItem('operator', JSON.stringify(operator));
}

export async function setOperatorTokenInAsyncStorage(token: string) {
  await AsyncStorage.setItem('operatorToken', token);
}

export async function setOperatorRolesInAsyncStorage(roles) {
  await AsyncStorage.setItem('operatorRoles', JSON.stringify(roles));
}

export async function getLoggedInOperator() {
  const operator = await AsyncStorage.getItem('operator');

  if (!operator) return null;
  
  return JSON.parse(operator);
}

export const getLoggedInOperatorToken = 
  async (): Promise<string | null> => AsyncStorage.getItem('operatorToken');

export const getLoggedInOperatorRoles = 
  async (): Promise<string | null> => AsyncStorage.getItem('operatorRoles');

export async function clearLoggedInOperator() {
  await AsyncStorage.clear();
}

export function sendTagOneSignalByOperator(operatorId) {
  // OneSignal.sendTag('user_id', String(operatorId));
}
