import {useState }from"react";

export function Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSubmit= async (e) => {
      e.preventDefault();

      await fetch("http://localhost:8080/api/login", {
          method:"POST",
          headers: {
              "Content-Type":"application/json",
          },
          body:JSON.stringify({ email, password,  withCredentials: true }),
          });
    };

  return (
    <form onSubmit={handleSubmit}>
    <input onChange={(e) =>setEmail(e.target.value)} placeholder="E-mail"/>
    <input type="password" onChange = {(e) =>setPassword(e.target.value)} placeholder="Mot de passe"/>
    <button type="submit">Login</button>
    </form>
    );
}