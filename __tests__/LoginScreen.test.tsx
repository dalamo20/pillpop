// // __tests__/LoginScreen.test.tsx

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import LoginScreen from '../screens/auth/LoginScreen';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import Toast from 'react-native-toast-message';

// jest.mock('firebase/auth', () => ({
//   getAuth: jest.fn(() => ({})),
//   signInWithEmailAndPassword: jest.fn(),
//   createUserWithEmailAndPassword: jest.fn(),
// }));

// jest.mock('react-native-toast-message', () => ({
//   show: jest.fn(),
// }));

// describe('LoginScreen', () => {
//   it('displays error if email/password is missing', async () => {
//     const { getByText } = render(<LoginScreen />);
//     fireEvent.press(getByText('Login'));

//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Missing Fields',
//         text2: 'Please enter both email and password.',
//       });
//     });
//   });

//   it('calls Firebase signInWithEmailAndPassword on login', async () => {
//     (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});

//     const { getByPlaceholderText, getByText } = render(<LoginScreen />);
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
//     fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
//     fireEvent.press(getByText('Login'));

//     await waitFor(() => {
//       expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
//         expect.anything(), // auth
//         'test@example.com',
//         'password123'
//       );
//     });
//   });
// });
