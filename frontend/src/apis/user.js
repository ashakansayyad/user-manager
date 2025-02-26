import axios from "axios";
import { addTokenToHeader } from "../utils/auth";
// user register
export const registerUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/user/register`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res;
};

// user login
export const loginUser = async (data) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/user/login`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res;
};

// add user with name and type
export const addUser = async (data) => {
  const headers = addTokenToHeader({ headers: {} });
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/user/add-user`,
    data,
    {
      headers,
    }
  );
  return res;
};
// get logged users data
export const getLoggedUserData = async(id)=>{
  const headers = addTokenToHeader({headers:{}});
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/get-user/${id}`,{
    headers
  });
  return res; 
}


// delete specefic user 
export const deleteUser = async(id)=>{
  const headers = addTokenToHeader({headers:{}});
  const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/user/delete-user/${id}`,{
    headers
  });
  return res; 
}

// get all users 
export const getAllUsers = async()=>{
  const headers  = addTokenToHeader({headers:{}});
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/get-all-users`,{
    headers
  })
  return res;
}

// search and filter user by name and type
export const getFilterUsers = async(name,type)=>{
  const headers  = addTokenToHeader({headers:{}});
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/filter-users`,{
    params:{name,type},
    headers
  })
  return res;
}