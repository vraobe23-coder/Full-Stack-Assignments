function showStudent() {
  let student = {
    name: "Rahul",
    age: 20,
    grade: "A"
  };

  student.class = "ECE";            // Add new property
  student.grade = "A+";             // Update grade

  let info = "";
  for (let key in student) {
    info += `${key}: ${student[key]}<br>`;
  }

  document.getElementById("result").innerHTML = info;
}
