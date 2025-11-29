function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = Number(document.getElementById("age").value);
  let msg = "";

  if (name === "") msg += "Name cannot be empty<br>";
  if (!/^\S+@\S+\.\S+$/.test(email)) msg += "Invalid email format<br>";
  if (age < 18 || age > 100) msg += "Age must be between 18 and 100<br>";

  document.getElementById("result").innerHTML = msg || "Form Submitted Successfully!";
}
