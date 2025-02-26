import React, { useState } from "react";
import styles from "./Register.module.css";
import { registerUser } from "../../apis/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    });

    const [error, setError] = useState({
        name: false,
        email: false,
        password: false,
        cpassword: false,
        isPasswordMatch: false,
    });

    //   password validation regex
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // email validation regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // name validation
    const namePattern = /^[a-zA-Z\s]*$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isError = false;
        if (!formData.name) {
            setError((prev) => ({ ...prev, name: true }));
            isError = true;
        } else if (!namePattern.test(formData.name)) {
            toast.error("Name can only contain alphabets.");
            isError = true;
        }
        if (!formData.email) {
            setError((prev) => ({ ...prev, email: true }));
            isError = true;
        } else if (!emailPattern.test(formData.email)) {
            toast.error("Please enter a valid email address");
            isError = true;
        }
        if (!formData.password) {
            setError((prev) => ({ ...prev, password: true }));
            isError = true;
        } else if (!passwordPattern.test(formData.password)) {
            toast.error("Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, symbol, and a number.");
            isError = true;
        }
        if(!formData.cpassword){
            setError((prev)=>({...prev,cpassword:true}));
            isError=true;
        }else if(formData.password !== formData.cpassword){
            setError((prev)=>({...prev,isPasswordMatch:true}));
            isError=true;
        }

        if(!isError){
            try{
                const {name,email,password} = formData;
                const userData = {name,email,password};
                const res = await registerUser(userData);
                if(res.status === 201){
                    toast.success("You Register Successfully!");
                    navigate('/login');
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
        <div className={styles.register}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Create Your Account</h2>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.inputGroup}>
              <input
                value={formData.name}
                name="name"
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError({ ...error, name: false });
                }}
                type="text"
                placeholder="Your Name"
                className={`${styles.input} ${error.name ? styles.error : ""}`}
              />
              {error.name && <p className={styles.errorText}>Name is required!</p>}
            </div>
  
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
                placeholder="Create Password"
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError({ ...error, password: false, isPasswordMatch: false });
                }}
                className={`${styles.input} ${error.password ? styles.error : ""}`}
              />
              {error.password && <p className={styles.errorText}>Password is required!</p>}
            </div>
  
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="cpassword"
                value={formData.cpassword}
                placeholder="Confirm Password"
                onChange={(e) => {
                  setFormData({ ...formData, cpassword: e.target.value });
                  setError({ ...error, cpassword: false, isPasswordMatch: false });
                }}
                className={`${styles.input} ${error.cpassword || error.isPasswordMatch ? styles.error : ""}`}
              />
              {error.cpassword && <p className={styles.errorText}>Confirm Password is required!</p>}
              {error.isPasswordMatch && <p className={styles.errorText}>Passwords don't match!</p>}
            </div>
  
            <button type="submit" className={styles.registerButton}>
              Register Now
            </button>
  
            <p className={styles.loginLink}>
              Already have an account?
             <button className={styles.link}
             onClick={()=>navigate('/login')}
             >
              Login here
              </button> 
                
            
            </p>
          </form>
        </div>
      </div>
    );
}

export default Register;
