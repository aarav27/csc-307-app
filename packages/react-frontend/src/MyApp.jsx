import React, {useState, useEffect} from "react";
import Table from './Table'
import Form from './Form'


function MyApp(){
    const [characters, setCharacters] = useState([])

    function removeOneCharacter(index){
        const personToDelete = characters[index];
        deleteUser(personToDelete.id)
            .then((response) => {
                if(response.status == 204){
                    const updated = characters.filter((character) => character.id != personToDelete.id);
                    setCharacters(updated);
                }
                else{
                    throw new Error("User Not Deleted: " + response.status)
                }
            })
            .catch((error) => {console.log(error)});
    }

    function updateList(person){
        postUser(person)
            .then((response) => {
                if(response.status == 201) {
                    return response.json()
                }
                else{
                    throw new Error("User Not Added: " + response.status);
                }
            })
            .then((newPerson) => setCharacters([...characters, newPerson]))
            .catch((error) => {console.log(error)});
    }

    function fetchUsers(){
        const promise = fetch("http://localhost:8000/users")
        return promise
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {console.log(error);});
    }, []);

    function postUser(person){
        const promise = fetch("http://localhost:8000/users", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person)
        });
        return promise
    }

    function deleteUser(person_id){
        const promise = fetch(`http://localhost:8000/users/${person_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        return promise
    }

    return(
        <div className="container">
            <Table 
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList}/>
        </div>
    );
}

export default MyApp;