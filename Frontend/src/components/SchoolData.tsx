import { useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google"; // Import Google OAuth components
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./SchoolData.css";
import { useNavigate } from "react-router-dom";

interface Errors {
  SchoolName?: JSX.Element;
  SchoolAddress?: JSX.Element;
  SchoolPhone?: JSX.Element;
  SchoolEmail?: JSX.Element;
}

function SchoolData() {
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");

  const handleSignIn = async () => {
    if (!validate()) return;
    const schoolData = { schoolName, schoolAddress, schoolPhone, schoolEmail };
    try {
      const response = await axios.post(
        "http://localhost:8080/api/schools",
        schoolData
      );
      console.log("School registered:", response.data);
      const navigate = useNavigate();
      navigate("/signAdmin");
    } catch (error) {
      console.error("Error registering the school:", error);
    }
  };

  const [errors, setErrors] = useState<Errors>({});
  const validate = () => {
    const newErrors: Errors = {};
    if (!schoolName) {
      newErrors.SchoolName = (
        <div className="alert alert-warning">Please enter a School Name.</div>
      );
    }
    if (!schoolAddress) {
      newErrors.SchoolAddress = (
        <div className="alert alert-warning">
          Please enter a School Address.
        </div>
      );
    }
    if (!schoolPhone || !/^\d{10}$/.test(schoolPhone)) {
      newErrors.SchoolPhone = (
        <div className="alert alert-warning">
          Please enter a valid 10-digit phone number.
        </div>
      );
    }
    if (!schoolEmail || !/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(schoolEmail)) {
      newErrors.SchoolEmail = (
        <div className="alert alert-warning">
          Please enter a valid email address.
        </div>
      );
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLoginSuccess = (response: CredentialResponse) => {
    console.log("Google Login Successful:", response);
    // You can use `response.credential` to authenticate with your backend if needed
  };

  const handleGoogleLoginFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="606916385379-umd6adietft9iggl3of2dlamio1hj2nq.apps.googleusercontent.com">
      <MDBContainer fluid className="h-custom">
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12" className="m-5">
            <MDBCard
              className="card-registration"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow>
                  <MDBCol md="6" className="p-5 bg-white">
                    <h3 className="fw-normal mb-5" style={{ color: "#4835d4" }}>
                      General Information
                    </h3>
                    <MDBInput
                      wrapperClass="mb-4"
                      label="School Name"
                      size="lg"
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                    {errors.SchoolName}

                    <MDBInput
                      wrapperClass="mb-4"
                      label="School Address"
                      size="lg"
                      type="text"
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                    />
                    {errors.SchoolAddress}

                    <MDBInput
                      wrapperClass="mb-4"
                      label="School Phone"
                      size="lg"
                      type="text"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                    />
                    {errors.SchoolPhone}

                    <MDBInput
                      wrapperClass="mb-4"
                      label="School Email"
                      size="lg"
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                    />
                    {errors.SchoolEmail}

                    <MDBBtn color="primary" size="lg" onClick={handleSignIn}>
                      Register
                    </MDBBtn>

                    {/* Google Sign-Up Option */}
                    <div className="mt-4">
                      <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailure}
                      />
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </GoogleOAuthProvider>
  );
}

export default SchoolData;
