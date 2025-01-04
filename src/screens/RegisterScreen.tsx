import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph, Button as PaperButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../services/api';
import { RootStackParamList } from '../types/index';

const RegisterScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState('');

	const handleRegister = async () => {
		setLoading(true);
		try {
			await register(username, password, email);
			setDialogMessage('Registration successful!');
			setVisible(true);
		} catch (error: any) {
			console.error('Failed to register:', error.message);
			setDialogMessage('Registration failed. Please try again.');
			setVisible(true);
		} finally {
			setLoading(false);
		}
	};

	const handleDialogDismiss = () => {
		setVisible(false);
		if (dialogMessage.includes('successful')) {
			navigation.navigate('Login');
		}
	};

	return (
		<LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradientBackground}>
			<View style={styles.container}>
				<Card style={styles.card}>
					<Card.Content>
						<Text style={styles.title}>Create Account</Text>
						<Text style={styles.subtitle}>Sign up to get started</Text>
						<Input placeholder="Username" value={username} onChangeText={setUsername} />
						<Input placeholder="Email" value={email} onChangeText={setEmail} />
						<Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
						<Button title={loading ? 'Registering...' : 'Register'} onPress={handleRegister} disabled={loading} />
					</Card.Content>
				</Card>
				<Portal>
					<Dialog visible={visible} onDismiss={handleDialogDismiss}>
						<Dialog.Title>{dialogMessage.includes('successful') ? 'Success' : 'Error'}</Dialog.Title>
						<Dialog.Content>
							<Paragraph>{dialogMessage}</Paragraph>
						</Dialog.Content>
						<Dialog.Actions>
							<PaperButton onPress={handleDialogDismiss}>OK</PaperButton>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	gradientBackground: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
	},
	card: {
		padding: 20,
		borderRadius: 12,
		elevation: 6,
		backgroundColor: '#ffffffee', // Semi-transparan untuk menyatu dengan gradasi
		marginHorizontal: 16,
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#333',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginBottom: 16,
	},
});

export default RegisterScreen;
