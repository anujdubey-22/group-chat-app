async function handleSignup(event) {
  try {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const response = await axios.post("http://localhost:3000/user/signup", {
      name: name,
      email: email,
      phone: phone,
      password: password,
    });
    console.log(response);
    if(response.status===201){
        alert("Successfuly signed up");
        console.log('user signup done')
        window.location.href='./login.html'
    }
  } catch (error) {
    if (error.response.status===409){
        alert("User already exists, Please Login");
    }
    console.log(error,'error in user signup')
  }
}
