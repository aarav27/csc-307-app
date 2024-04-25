import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import User from "./user.js"
// Helpful Note: Use export DEBUG='express:router'

const app = express();
const port = 8000;

mongoose.set("debug", true);

mongoose
    .connect("mongodb://localhost:27017/users", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((error) => console.log(error));

function getUsers(name, job){
    let promise;
    if (name === undefined && job === undefined){
        promise = User.find()
    }
    else if(name && !job){
        promise = findUserByName(name)
    }
    else if(job && !name){
        promise = findUserByJob(job)
    }
    else if(name && job){
        promise = findUserByNameJob(name, job)
    }
    return promise;
}

const findUserById = (id) => {
    return User.findById(id);
}

const findUserByName = (name) => {
    return User.find({name: name});
}
  
const findUserByJob = (job) => {
    return User.find({job: job});
}

const findUserByNameJob = (name, job) => {
    return User.find({name: name, job: job})
}

function addUser(user){
    const userToAdd = new User(user);
    const promise = userToAdd.save();
    return promise
}

const deleteUserByID = (id) => {
    return User.findByIdAndDelete(id);
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.get('/users', (req,res) => {
    const name = req.query.name;
    const job = req.query.job
    getUsers(name, job)
        .then((result) => {
            const users = {user_list: result}
            res.send(users)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send('Internal Server Error');
        })
});

app.get('/users/:id', (req, res) => {
    const id = req.params["id"]
    findUserById(id)
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send("Resource Not Found");
        })
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch(() => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        })
})

app.delete('/users/:id', (req, res) => {
    const user_id = req.params["id"];
    deleteUserByID(user_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((error) => {
            console.log(error);
            res.status(404).send("Resource Not Found");
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
