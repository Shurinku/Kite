import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

function LoginForm() {
  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "https://62543bbd89f28cf72b5a6911.mockapi.io/login",
      { name: user, password: pwd }
    );
    setUser(user);
    setPwd(pwd);
    setSuccess(true);
  };

  const Logout = () => {
    setUser("");
    setPwd("");
    setSuccess(false);
  };
  return (
    <>
      {success ? (
        <Dashboard Logout={Logout}></Dashboard>
      ) : (
        <div className="main">
          <form onSubmit={handleSubmit} className="loginForm">
            <div className="form-inner">
              <h1 className="logo">Kite</h1>
              <div className="form-group">
                <input
                  className="loginInput"
                  type="text"
                  name="username"
                  id="name"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  placeholder="Username      /use anything"
                ></input>
              </div>
              <div className="form-group">
                <input
                  className="loginInput"
                  type="password"
                  id="password"
                  placeholder="Password      /use anything"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                />
              </div>
              <button className="submitBtn" type="submit" value="Login">
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginForm;
