import { useState } from "react";
import {
  ActivityIndicator,
  type PressableStateCallbackType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "../../components/Screen";
import { useAuthStore } from "../../store/authStore";

export function SignInScreen() {
  const signIn = useAuthStore((state) => state.signInWithPassword);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    const result = await signIn(email.trim(), password);
    if (!result.success) {
      setError(result.errorMessage);
    }
    setSubmitting(false);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>TrailerGuard</Text>
        <Text style={styles.subtitle}>Sign in to your fleet workspace</Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#667085"
          style={styles.input}
          value={email}
        />

        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#667085"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable
          disabled={submitting}
          onPress={handleSignIn}
          style={({ pressed }: PressableStateCallbackType) => [
            styles.button,
            pressed && { opacity: 0.85 },
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94A3B8",
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#7CC7FF",
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    color: "#020617",
    fontWeight: "800",
    fontSize: 15,
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 4,
  },
});
