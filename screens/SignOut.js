import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/actions/authActions'; // Assuming you have a signOut action

export default function SignOut({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signOut());
    navigation.navigate('Signin');
  }, [dispatch, navigation]);

  return null;
}