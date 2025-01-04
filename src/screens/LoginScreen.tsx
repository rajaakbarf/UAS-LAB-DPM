import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Portal, Dialog, Paragraph, Button as PaperButton, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/api";
import { setAuthToken } from "../utils/auth";
import { AuthResponse, ApiError } from "../types/index";

type RootStackParamList = {
	MainTabs: undefined;
	Register: undefined;
};

const LoginScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	const handleLogin = async () => {
		if (!username || !password) {
			setDialogMessage("Please fill in all fields");
			setVisible(true);
			return;
		}

		setLoading(true);
		try {
			const response = (await login(username, password)) as AuthResponse;
			await setAuthToken(response.data.token);
			navigation.reset({
				index: 0,
				routes: [{ name: "MainTabs" }],
			});
		} catch (error: any) {
			const apiError = error as ApiError;
			const errorMessage = apiError.data?.message || "Something went wrong";
			const errors = apiError.data?.errors;
			console.log("Error details:", errors);
			const passwordError = errors?.password;
			const usernameError = errors?.username;
			setDialogMessage(
				passwordError
					? `${errorMessage}: ${passwordError}`
					: usernameError
					? `${errorMessage}: ${usernameError}`
					: errorMessage
			);
			setVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#6a11cb", "#2575fc"]}
			style={styles.gradientBackground}
		>
			<View style={styles.container}>
				<Card style={styles.card}>
					<Card.Content>
						<Text style={styles.title}>Welcome Back</Text>
						<Text style={styles.subtitle}>Login to your account</Text>
						<Input
							placeholder="Username"
							value={username}
							onChangeText={setUsername}
						/>
						<Input
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
						<Button
							title={loading ? "Logging in..." : "Login"}
							onPress={handleLogin}
							disabled={loading}
						/>
						<TouchableOpacity
							style={styles.registerLink}
							onPress={() => navigation.navigate("Register")}
						>
							<Text style={styles.registerText}>
								Don't have an account? Register
							</Text>
						</TouchableOpacity>
					</Card.Content>
				</Card>
				<Portal>
					<Dialog visible={visible} onDismiss={() => setVisible(false)}>
						<Dialog.Title>Error</Dialog.Title>
						<Dialog.Content>
							<Paragraph>{dialogMessage}</Paragraph>
						</Dialog.Content>
						<Dialog.Actions>
							<PaperButton onPress={() => setVisible(false)}>OK</PaperButton>
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
		justifyContent: "center",
		padding: 16,
	},
	card: {
		padding: 20,
		borderRadius: 12,
		elevation: 6,
		backgroundColor: "#ffffffee", // Transparan agar menyatu dengan gradasi
		marginHorizontal: 16,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "center",
		color: "#333",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 16,
	},
	registerLink: {
		marginTop: 15,
		alignItems: "center",
	},
	registerText: {
		color: "#2575fc",
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default LoginScreen;
