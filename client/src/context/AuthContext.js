import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();
const newHabitId = uuidv4();
const newLabelId = uuidv4();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUserToDatabase = async (uid, email, username) => {
    try {
      // send the user data to your PHP API
      const response = await axios.post(
        "http://localhost/huetrack/registerUser.php",
        {
          uid, // firebase User ID
          email,
          username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // check the response from the API
      if (response.data.status === 0) {
        throw new Error(response.data.message); // throw an error if registration failed
      }

      // insert a default habit for when user creates account
      // can be changed later
      await axios.post("http://localhost/huetrack/addHabits.php", {
        habit_id: newHabitId,
        uid, // use Firebase UID
        habit_name: "Alcohol Intake", // set the default habit name
      });

      // define 5 default labels with random colors
      const defaultLabels = [
        { label_id: uuidv4(), label_name: "Blackout", label_color: "#808080" },
        {
          label_id: uuidv4(),
          label_name: "3 Drinks",
          label_color: "#F36D65",
        },
        { label_id: uuidv4(), label_name: "2 Drinks", label_color: "#0000ff" },
        { label_id: uuidv4(), label_name: "1 Drink", label_color: "#ECC7A1" },
        { label_id: uuidv4(), label_name: "None", label_color: "#B4BC8C" },
      ];

      // insert the default labels into the database
      await axios.post("http://localhost/huetrack/addLabels.php", {
        habit_id: newHabitId, // the habit_id created earlier
        labels: defaultLabels,
      });

      console.log("User data stored in the database successfully!");
    } catch (error) {
      console.error("Error storing user data in database: ", error);
    }
  };

  const createUser = async (email, password, username) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = response.user;

      // store user data in your database
      await registerUserToDatabase(firebaseUser.uid, email, username);
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // propagate error to the Signup component
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //console.log(currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ createUser, user, logout, signIn }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
