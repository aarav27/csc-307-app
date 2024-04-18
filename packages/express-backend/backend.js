import express from "express";
import cors from "cors";
// Helpful Note: Use export DEBUG='express:router'

const app = express();
const port = 8000;

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
  }

const findUserById = (id) => {
    return users["users_list"].find(
        (user) => user["id"] === id
    )
  }

const findUserByNameJob = (name, job) => {
    return users["users_list"].filter(
        (user) => (user["name"] === name && user["job"] === job)
    )
}

const addUser = (user) => {
    const user_id = generateRandomUserID()
    user["id"] = user_id;
    users["users_list"].push(user);
    return user
}

const deleteUserByID = (id) => {
    const userToDelete = users["users_list"].find((user) => user["id"] == id)
    if (userToDelete !== undefined){
        users["users_list"] = users["users_list"].filter(user => user != userToDelete);
    }
    return userToDelete;
}

const generateRandomUserID = () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let string_id = "";
    let num_id = "";
    for(let i = 0; i < 3; i += 1){
        string_id += letters[parseInt(Math.random() * letters.length)];
        num_id += String(parseInt(Math.random() * 10));
    }
    const user_id = string_id + num_id;
    return user_id
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.get('/users', (req,res) => {
    const name = req.query.name;
    const job = req.query.job
    if(name != undefined){
        let result = findUserByName(name);
        if (job != undefined){
            result = findUserByNameJob(name, job)
        }
        result = { users_list: result };
        res.send(result)
    }
    else{
        res.send(users)
    }
});

app.get('/users/:id', (req, res) => {
    const id = req.params["id"]
    let result = findUserById(id);
    if(result === undefined){
        res.status(404).send("Resource Not Found");
    }
    else{
        res.send(result);
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const newUser = addUser(userToAdd);
    res.status(201).send(newUser);
})

app.delete('/users/:id', (req, res) => {
    const user_id = req.params["id"];
    const result = deleteUserByID(user_id);
    if(result === undefined){
        res.status(404).send("Resource Not Found");
    }
    else{
        res.status(204).send();
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
