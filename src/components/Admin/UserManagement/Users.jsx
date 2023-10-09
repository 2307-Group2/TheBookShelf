import { useState } from "react";
import UserSearchBar from "./UserSearchBar";
import UserList from "./UserList";
import AddUser from "./AddUser";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} from "../../../reducers/api";
import { useMeQuery } from "../../../reducers/authSlice";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editUser] = useEditUserMutation();
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  console.log("In users - users", users);
  //meQuery for current user data
  const {
    data: currentUser,
    isError: isUserError,
    isLoading: isUserLoading,
  } = useMeQuery();

  console.log("currentuser in users", currentUser);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const toggleAddUserForm = () => {
    setShowAddUserForm((prevShow) => !prevShow);
  };

  const handelUserAdded = () => {
    refetch();
    setShowAddUserForm(false);
  };

  const handlePromoteToAdmin = async (userId) => {
    const user = users.find((i) => i.id === userId);
    if (user) {
      const updatedUser = { ...user, isAdmin: !user.isAdmin }; //Toggle admin status
      try {
        await editUser(updatedUser).unwrap();
        alert(`${user.username} admin status updated!`);
      } catch (error) {
        alert(
          `Error updating admin status for ${user.username}: ${error.message}`
        );
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      alert("User deleted successfully");
    } catch (error) {
      alert(`Error deleted user: ${error.message}`);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error fetching users</p>;

  const filteredUser = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="display-4">User Accounts</h2>

      <Alert variant="primary">Welcome, {currentUser.firstName}</Alert>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            {currentUser.firstName} {currentUser.lastName}
          </Card.Title>
          <Card.Text>Email: {currentUser.email}</Card.Text>
          <Card.Text>Status: Admin</Card.Text>
        </Card.Body>
      </Card>

      <div className="my-3">
        <UserSearchBar onSearch={handleSearch} />
      </div>

      <Button variant="success" className="mb-3" onClick={toggleAddUserForm}>
        {showAddUserForm ? "Hide Add User Form" : "Add User"}
      </Button>
      {showAddUserForm && (
        <AddUser onUserAdded={handelUserAdded} refetch={refetch} />
      )}

      <UserList
        users={filteredUser}
        onPromote={handlePromoteToAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Users;
