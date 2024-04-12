async function handleLogin(event) {
  try {
    console.log('login clicked')
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = await axios.post("http://localhost:3000/user/login", {
      email: email,
      password: password,
    });
    console.log(data, "data in login.js");
    //localStorage.setItem('token':data.response.token);

  } 
  catch (error) {
    console.log(error, "error in login.js");
    const div = document.getElementById("error");
    div.innerHTML = "";
    div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...404 ${error.response.data}</h3> </div>`;
    console.log(error.response);
  }
}
