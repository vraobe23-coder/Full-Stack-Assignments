function processArray() {
  let arr = document.getElementById("arr").value.split(",").map(Number);

  let largest = Math.max(...arr);
  let smallest = Math.min(...arr);
  let asc = [...arr].sort((a, b) => a - b);
  let desc = [...arr].sort((a, b) => b - a);

  document.getElementById("result").innerHTML = `
    Largest = ${largest}<br>
    Smallest = ${smallest}<br>
    Ascending = ${asc}<br>
    Descending = ${desc}
  `;
}
