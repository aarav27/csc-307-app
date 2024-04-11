import express from "express";
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
    users["users_list"].push(user);
    return user
}

const deleteUserByID = (id) => {
    const userToDelete = users["users_list"].find(
        (user) => user["id"] == id
    )
    users["users_list"].pop(userToDelete);
    return userToDelete;
}

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
    console.log(result)
    if(result === undefined){
        res.status(404).send("Resource Not Found");
    }
    else{
        res.send(result);
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send(`Added User With User ID ${userToAdd["id"]}`);
})

app.delete('/users', (req, res) => {
    const user_id = req.body
    deleteUserByID(user_id["id"]);
    res.send(`Deleted User With User ID ${user_id["id"]}`);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
