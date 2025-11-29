function calculate() {
  let a = Number(document.getElementById("num1").value);
  let b = Number(document.getElementById("num2").value);

  let result = `
    Sum = ${a + b}<br>
    Difference = ${a - b}<br>
    Product = ${a * b}<br>
    Quotient = ${b !== 0 ? a / b : "Undefined (division by zero)"}
  `;
  document.getElementById("result").innerHTML = result;
}
