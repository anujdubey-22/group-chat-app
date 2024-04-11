async function handleLogin(event) {
  try {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = await axios.post("http://localhost:3000/user/login", {
      email: email,
      password: password,
    });
    console.log(data, "data in login.js");
  } 
  catch (error) {
    console.log(error, "error in login.js");
  }
}
