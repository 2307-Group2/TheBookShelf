import { useState } from "react";
import { useAddUserMutation } from "../../../reducers/api";
import TextInput from "../../inputs/TextInput";

function AddUser({ onUserAdded, refetch }) {
  const initialFormData = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  };

  const [userData, setUserData] = useState(initialFormData);
  const [addUser, { isLoading, isError, isSuccess, error }] =
    useAddUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(userData).unwrap();
      setUserData(initialFormData);
      refetch();
      onUserAdded && onUserAdded();
    } catch {
      err;
    }
    console.error("Error adding user:", err.message);
  };

  return (
    <div>
      <h3 className="mb-3">Add User</h3>
      {isSuccess && (
        <div className="alert alert-success">User added successfully!</div>
      )}
      {isError && (
        <div className="alert alert-danger">
          Error adding user: {error.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <TextInput
            type="text"
            vl={userData.firstName}
            chg={(value) =>
              setUserData((prevState) => ({ ...prevState, firstName: value }))
            }
            placeholder="First Name"
          />
        </div>
        <div className="form-group">
          <TextInput
            type="text"
            vl={userData.lastName}
            chg={(value) =>
              setUserData((prevState) => ({ ...prevState, lastName: value }))
            }
            placeholder="Last Name"
          />
        </div>
        <div className="form-group">
          <TextInput
            type="text"
            vl={userData.username}
            chg={(value) =>
              setUserData((prevState) => ({ ...prevState, username: value }))
            }
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <TextInput
            type="text"
            vl={userData.email}
            chg={(value) =>
              setUserData((prevState) => ({ ...prevState, email: value }))
            }
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <TextInput
            type="text"
            vl={userData.password}
            chg={(value) =>
              setUserData((prevState) => ({ ...prevState, password: value }))
            }
            placeholder="Default Password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;
