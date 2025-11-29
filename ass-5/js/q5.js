function processArray() {
  let arr = document.getElementById("arr").value.split(",").map(Number);

  let evens = arr.filter(n => n % 2 === 0);
  let doubled = evens.map(n => n * 2);
  let sum = doubled.reduce((total, n) => total + n, 0);

  document.getElementById("result").innerHTML = `
    Even Numbers = ${evens}<br>
    After Multiplying by 2 = ${doubled}<br>
    Sum = ${sum}
  `;
}
