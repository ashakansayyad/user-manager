const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();


// user registeration 
router.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
   
    try{
      
        // check if user is already exist or not
        const userExist = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({message:"User already exist!"});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10); 

        // create new user and save
        const newUser = await pool.query("INSERT INTO users(name,email,password) VALUES ($1,$2,$3) RETURNING *",
            [name,email,hashedPassword]
        );
        const user = newUser.rows[0];
        return res.status(201).json({message:"User Register Successfully!",user});
    }catch(err){
        console.error("Error: ",err);
        return res.status(400).json({message:"user registeration failed"});
    }
})

// user login
router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
        // check email is exist or not
        const userExist = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(userExist.rows.length === 0 ){
            return res.status(400).json({message:"Wrong email or password"});
        }
        // get user obj in array
        const user  = userExist.rows[0];

        // compare the input password with hashed password
        const isPasswordMatch = await bcrypt.compare(password,user.password)

        if(!isPasswordMatch){
            return res.status(400).json({message:"Wrong email or password"});
        }
        // Generate JWT
        // create payload witch contain user id
        const payload = {id: user.id};
        
        // assign the token using secret key
        const token = jwt.sign(payload,process.env.JWT_SECRET);

        return res.status(200).json({token})
    }catch(err){
        console.error("Error: ",err);
        return res.status(400).json({message:"Something went wrong!"});
    }
});

// get specefic user by id
router.get("/get-user/:id",authMiddleware,async(req,res)=>{
    const userId = req.params.id;
    try{
        const userById = await pool.query("SELECT id,name,email,type FROM users WHERE id = $1",[userId]);
        if(userById.rows.length === 0 ){
            return res.status(404).json("user not found!");
        }
        const user = userById.rows[0];
        return res.status(200).json(user);
    }catch(err){
        console.error("Error: ",err);
        return res.status(404).json({ message: "User data not found" });
    }
})

// Get all users 
router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        // Get users who do NOT have an email 
        const users = await pool.query(
            "SELECT id, name, type FROM users WHERE email IS NULL OR email = ''"
        );

        if (users.rows.length === 0) {
            return res.status(404).json("No users found without an email!");
        }

        return res.status(200).json(users.rows);
    } catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: "Error retrieving user data" });
    }
});



//add users with name and type
router.post("/add-user",authMiddleware,async(req,res)=>{
    const {name,type} = req.body;
    try{
        //check type is valid or not

        const isValidType = ["child","mother","father","teacher"];
        if(!isValidType.includes(type)){
            return res.status(400).json({message:"Invalid user type!"});
        } 
        await pool.query("INSERT INTO users(name,type) VALUES($1,$2) RETURNING *",[name,type])

        return res.status(201).json({message:"User added Successfully!"});
    }catch(err){
        console.error("Error: ", err);
        return res.status(400).json({ message: "Failed to add user" });
    }
})

// delete specefic user
router.delete("/delete-user/:id",authMiddleware,async(req,res)=>{
    userId = req.params.id;
    
    try{
        const deleteUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *",[userId]);
        if(!deleteUser.rows.length === 0){
            return res.status(400).json({message:"User not found!"});
        }
        res.status(200).json({ message: "User deleted successfully!" });
    }catch(err){
        console.error("Error deleting user:", err);
        res.status(400).json({ message: "Internal server error" });
    }
})

//search and filter by name and type
router.get("/filter-users",authMiddleware,async(req,res)=>{
    const {name,type} = req.query;  //get search and fiter parameters
    try{
        let query = "SELECT id,name,email,type FROM users WHERE 1=1";
        let values = [];

        if(name){
            query += " AND name ILIKE $1";   //ILIKE for case-insensitive search
            values.push(`%${name}%`);       //% allows partial search
        }

        if(type){
            // if name is already set type is $2 otherwise $1
            query += name ? " AND type = $2" : " AND type = $1" ;
            values.push(type);
        }
        // execute query with dynamically
        const filterUsers = await pool.query(query,values);
        return res.status(200).json(filterUsers.rows);

    }catch(err){
        console.error("Error fetching users:", err);
        res.status(400).json({ message: "Failed to search users" });
    }
})

module.exports = router;