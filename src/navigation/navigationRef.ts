import { createRef } from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    console.error('Navigation reference not set. Cannot navigate to:', name);
  }
}

export function reset(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{ name, params }],
    });
  } else {
    console.error('Navigation reference not set. Cannot reset to:', name);
  }
}

export function goBack() {
  if (navigationRef.current && navigationRef.current.canGoBack()) {
    navigationRef.current.goBack();
  } else {
    console.error('Navigation reference not set or cannot go back');
  }
}

export function dispatch(action: any) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(action);
  } else {
    console.error('Navigation reference not set. Cannot dispatch action');
  }
}

export function replace(name: string, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  } else {
    console.error('Navigation reference not set. Cannot replace with:', name);
  }
} 