// backend.js
import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

  app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job != undefined){
      userServices.findUserByJobAndName(job, name).then((result) => {
        res.send(result)
        //res.status(200).send({ users_list: result })
      }).catch((error) => {
        console.error("Couldn't find user by name and job");
        res.status(500).send();
      });
    }
    else if (name != undefined) {
      userServices.findUserByName(name).then((result) => {
      res.status(200).send({ users_list: result });
      }).catch((error) => {
        console.error("Couldn't find user by name");
        res.status(500).send();
      });
    }
    else if (job != undefined) {
      userServices.findUserByJob(job).then((result) => {
      res.status(200).send({ users_list: result });
      }).catch((error) => {
        console.error("Couldn't find user by job");
        res.status(500).send();
      });
    } else {
      userServices.getUsers().then((result) => res.send(result)).catch((error) => {
        console.error("Couldn't get users");
        res.status(500).send();
      });
    }
  });
  
  app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userServices.findUserById(id).then((result) => {
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  }).catch((error) => {
    console.error("Couldn't get users by id");
    res.status(500).send();
  });
  });
  
  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userServices.addUser(userToAdd).then((result) => res.status(201).json(result).send())
    .catch((error) => {
    console.error("Couldn't add user")
    res.status(500).send()
  });
  });

  app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userServices.findUserById(id).then((result) => {
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        userServices.removeUserByID(id).then(() => res.status(204).send()).catch((error) => {
          console.error("Couldn't add user")
          res.status(500).send()
        });
        
    }
    }).catch(console.error("Couldn't remove user"))
  });