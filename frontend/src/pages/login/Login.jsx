import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../apis/user';
import styles from './Login.module.css';
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      
      email: "",
      password: "",
     
  });

  const [error, setError] = useState({
      
      email: false,
      password: false,
      
  });

 

  const handleSubmit = async (e) => {
      e.preventDefault();
      let isError = false;
     
      if (!formData.email) {
          setError((prev) => ({ ...prev, email: true }));
          isError = true;
      } 
      if (!formData.password) {
          setError((prev) => ({ ...prev, password: true }));
          isError = true;
      }
     

      if(!isError){
          try{
              const {email,password} = formData;
              const userData = {email,password};
              const res = await loginUser(userData);
              if(res.status === 200){
                  toast.success("You Logged in Successfully!");
                  localStorage.setItem("token",res.data.token);
                  navigate('/');
              }

          }catch(err){
              if(err.response && err.response.status === 400){
                  toast.error(err.response.data.message);
                }else{
                  console.error(err.response);
                }
          }
      }

  }


  return (
    <div className={styles.login}>
    <div className={styles.formWrapper}>
      <h2 className={styles.title}>Welcome Back</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Your Email"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError({ ...error, email: false });
            }}
            className={`${styles.input} ${error.email ? styles.error : ""}`}
          />
          {error.email && <p className={styles.errorText}>Email is required!</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Your Password"
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setError({ ...error, password: false });
            }}
            className={`${styles.input} ${error.password ? styles.error : ""}`}
          />
          {error.password && <p className={styles.errorText}>Password is required!</p>}
        </div>

        <button type="submit" className={styles.loginButton}>
          Login Now
        </button>

        <p className={styles.registerLink}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className={styles.link}>
            Register here
          </span>
        </p>
      </form>
    </div>
  </div>
  );
}

export default Login
