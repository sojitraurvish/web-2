import Admin from "../models/Admin.js";
import Course from "../models/Course.js";

export const signup = async (req, res, next) => {

  const userName = req.header.username;
  const password = req.header.password;

  const admin = new Admin({ userName, password });
  await admin.save();
  res.status(201).json({ message: "Admin created successfully" });
  
  // const { username, password } = req.body;
  // const admin = new Admin({ username, password });
  // await admin.save();
  // res.status(201).json({ message: "Admin created successfully" });
};

export const courses = async (req, res, next) => {
  // const { username, password } = req.body;
  // const courses = await Course.find();
  // res.status(200).json({ courses });
};
