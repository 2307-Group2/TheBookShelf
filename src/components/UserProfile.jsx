import { useState } from "react";
import TextInput from "./inputs/TextInput";
import { useEditUserMutation } from "../reducers/api";
import { useMeQuery } from "../reducers/authSlice";
import { useParams } from "react-router-dom";
import { Card, Alert, Button } from "react-bootstrap";

function UserProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [isUpdated, setIsUpdated] = useState(false);

  const { id } = useParams();
  const { data: userData, isLoading, isError, refetch } = useMeQuery();
  const [editUser, { isLoading: isSaving }] = useEditUserMutation();

  const resetFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      id: userData.id,
      ...formData,
      isAdmin: userData.isAdmin,
    };

    Object.keys(updatedData).forEach(
      (key) => !updatedData[key] && delete updatedData[key]
    );

    try {
      await editUser(updatedData).unwrap();
      refetch();
      setIsUpdated(true);
      resetFields();
      setTimeout(() => {
        setIsUpdated(false);
      }, 3000);
    } catch (error) {
      alert(`Error updating profile: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading your profile...</div>;
  if (isError)
    return <div>Error loading your profile. Please try again later.</div>;

  const displayName = userData.firstName || userData.username;

  return (
    <div className="container mt-5">
      <h1>My Account</h1>
      <h3 className="text-success">Welcome back {displayName}!</h3>
      {userData && (
        <div className="card mb-4 p-3">
          <h5 className="text-primary">
            {formData.firstName || userData.firstName
              ? "Your Profile Information"
              : "Update Your Profile Below"}
          </h5>
          {isUpdated && (
            <div className="alert alert-success">
              Your profile updated successfully!
            </div>
          )}
          <p>
            <strong>First Name:</strong> {userData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Street Address:</strong> {userData.streetAddress}
          </p>
          <p>
            <strong>City:</strong> {userData.city}
          </p>
          <p>
            <strong>State:</strong> {userData.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {userData.zipCode}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone}
          </p>
          {userData.isAdmin && (
            <p>
              <strong>Status:</strong> Admin
            </p>
          )}
          {!userData.isAdmin && (
            <p>
              <strong>Status:</strong> User
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h4 className="text-primary mb-3">Update Your Information</h4>

        <div className="mb-3">
          <label className="form-label">First Name</label>
          <TextInput
            vl={formData.firstName}
            chg={(val) => handleInputChange("firstName", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <TextInput
            vl={formData.lastName}
            chg={(val) => handleInputChange("lastName", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <TextInput
            vl={formData.email}
            chg={(val) => handleInputChange("email", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street Address</label>
          <TextInput
            vl={formData.streetAddress}
            chg={(val) => handleInputChange("streetAddress", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <TextInput
            vl={formData.city}
            chg={(val) => handleInputChange("city", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">State</label>
          <TextInput
            vl={formData.state}
            chg={(val) => handleInputChange("state", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Zip Code</label>
          <TextInput
            vl={formData.zipCode}
            chg={(val) => handleInputChange("zipCode", val)}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <TextInput
            vl={formData.phone}
            chg={(val) => handleInputChange("phone", val)}
            className="form-control"
          />
        </div>

        <button type="submit" disabled={isSaving} className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
