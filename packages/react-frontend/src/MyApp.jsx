// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form"

function MyApp() {

  const [characters, setCharacters] = useState([

  ]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function removeOneCharacter(index) {
    deleteUser(characters[index]["id"])
    .then((res) => {
      if (res.status === 204){
        const updated = characters.filter((_, i) => i !== index);
        setCharacters([...updated])
      }
      else {
        console.error("Request status not 204, instead server gave ", res.status);
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201){
          return res.json()
        }
        else {
          console.error("Request status not 201, instead server gave ", res.status);
        }
      })
      .then((json) => {
        setCharacters([...characters, json])
      })
      .catch((error) => {
        console.log(error);
      })
}

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
}

function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  return promise;
}

function deleteUser(id) {
  const url = "Http://localhost:8000/users/" + id;
  const promise = fetch("Http://localhost:8000/users/" + id, {
    method: "DELETE"
  });

  return promise;
}

  return (
    <div className="container">
      <Table 
      characterData={characters}
      removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
