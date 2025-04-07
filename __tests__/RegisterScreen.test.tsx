// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import RegisterScreen from '../screens/auth/RegisterScreen';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import Toast from 'react-native-toast-message';

// jest.mock('firebase/auth', () => ({
//   getAuth: jest.fn(() => ({})),
//   signInWithEmailAndPassword: jest.fn(),
//   createUserWithEmailAndPassword: jest.fn(),
// }));

// jest.mock('react-native-toast-message', () => ({
//   show: jest.fn(),
// }));

// describe('RegisterScreen', () => {
//   it('shows error when fields are empty', async () => {
//     const { getByText } = render(<RegisterScreen />);
//     fireEvent.press(getByText('Register'));
//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Missing Fields',
//         text2: 'Please fill in all fields.',
//       });
//     });
//   });

//   it('shows error when passwords do not match', async () => {
//     const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
//     fireEvent.changeText(getByPlaceholderText('Password'), '123456');
//     fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'wrongpassword');
//     fireEvent.press(getByText('Register'));

//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Password Mismatch',
//         text2: 'Passwords do not match.',
//       });
//     });
//   });

//   it('calls createUserWithEmailAndPassword with valid data', async () => {
//     (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});
//     const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
//     fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
//     fireEvent.changeText(getByPlaceholderText('Password'), '123456');
//     fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123456');
//     fireEvent.press(getByText('Register'));

//     await waitFor(() => {
//       expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', '123456');
//     });
//   });
// });
