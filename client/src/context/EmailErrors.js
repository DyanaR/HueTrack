export const handleEmailErrors = (code) => {
  switch (code) {
    case "auth/email-already-exists":
      return "This email is already in use. Try signing in or using a different email.";
    case "auth/email-already-in-use":
      return "This email is already in use. Try signing in or using a different email.";
    case "auth/invalid-email":
      return "Invalid email address. Please enter a valid email.";
    case "auth/invalid-email-verified":
      return "Invalid email verification status. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this information. Please check and try again.";
    case "auth/invalid-credential":
      return "There’s an issue with your credentials. Please try again.";
    default:
      return null; // No match found
  }
};
