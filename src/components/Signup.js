import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; //hooks

const Signup = (props) => {
  const [Credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = Credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const json = await response.json();
    console.log(json);

    if(json.success)// if succes: true
    {
//save the auth token and redirect
localStorage.setItem('token',json.authToken);
navigate('/');
props.showAlert("Acount Created Successfully","success")

    }
    else{
        props.showAlert("Invaild Details !!","danger")
    }
  };

  const onChange = (e) => {
    setCredentials({ ...Credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              onChange={onChange}
            />
          </div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            minLength={5}
            required
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            name="password"
            id="password"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            name="cpassword"
            id="cpassword"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
