export const handlePasswordErrors = (code) => {
  switch (code) {
    case "auth/invalid-password":
      return "Your password is too weak. Please use at least six characters.";
    case "auth/weak-password":
      return "Your password is too weak. Please use at least six characters.";
    case "auth/invalid-hash-algorithm":
      return "Unsupported password security method. Please try again.";
    case "auth/invalid-hash-block-size":
      return "Invalid security parameters. Please try again.";
    case "auth/missing-password":
      return "Password is required. Please enter your password.";
    default:
      return null;
  }
};
