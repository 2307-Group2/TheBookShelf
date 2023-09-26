const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await prisma.users.findMany();
    res.send(allUsers);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/:id",  async (req, res, next) => {
  
    try {
      const user = await prisma.users.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  });
  
  //Register new User
  router.post("/register", async (req, res, next) => {

    const salt_rounds = 5;

    try {
      const { username, password } = req.body;

      if(!username || !password) {
        return res.status(400).send("Username and password are required");
      }
      const hashedPassword = await bcrypt.hash(password, salt_rounds);

      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword }
      });

      const token = jwt.sign({ id: user.id}, process.env.JWT);

      res.status(201).send({
        token,
        user: {
          userId: user.id,
          username: user.username
        },
      })
    } catch (err) {
      next(err);
    }
  });
  
  //Login User
  router.post("/login", async (req, res, next) => {

    try {
      console.log("login request recieved", req.body)
      const { username, password } = req.body;
      

      const user = await prisma.users.findUnique({
        where: { username },
      });

      console.log("User found", user)
      if(!user) {
        return res.status(401).send("Invalid Login");
      }

      const isValid = await bcrypt.compare(password, user.password);
      console.log("password verification", isValid)

      if(!isValid) {
        return res.status(401).send("Invalid Login");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT)
      res.send({
        token,
        user: {
          userId: user.id,
          username: user.username,
        }
      });
    } catch (err) {
      next(err);
    }
  });


  router.put("/:id",  async (req, res, next) => {
  
    try {
      const user = await prisma.users.update({
        where: {
          id: Number(req.params.id),
        },
        data: req.body,
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
