 (function () {
        const expressionEl = document.getElementById("expression");
        const resultEl = document.getElementById("result");
        const buttons = document.querySelectorAll(".calc-key");

        let expression = "";
        let lastResult = "";

        function updateDisplay() {
          expressionEl.textContent = expression || "0";
          resultEl.textContent = lastResult ? lastResult : "\u00A0";
        }

        function appendNumber(value) {
          if (expression === "0" && value !== ".") {
            expression = value;
          } else {
            expression += value;
          }
        }

        function appendOperator(op) {
          if (!expression) return;
          const lastChar = expression.slice(-1);
          if ("+-×÷".includes(lastChar)) {
            expression = expression.slice(0, -1) + op;
          } else {
            expression += op;
          }
        }

        function appendDecimal() {
          const parts = expression.split(/[\+\-×÷]/);
          const current = parts[parts.length - 1];
          if (current.includes(".")) return;
          if (!current) {
            expression += "0.";
          } else {
            expression += ".";
          }
        }

        function toEvalExpression(expr) {
          return expr.replace(/×/g, "*").replace(/÷/g, "/");
        }

        function calculate() {
          if (!expression) return;
          try {
            const safeExpr = toEvalExpression(expression);
            const value = Function("return " + safeExpr)();
            if (value === undefined || Number.isNaN(value)) return;
            lastResult = new Intl.NumberFormat().format(value);
          } catch (e) {
            lastResult = "Error";
          }
        }

        function percent() {
          if (!expression) return;
          try {
            const safeExpr = toEvalExpression(expression);
            const value = Function("return " + safeExpr)();
            if (value === undefined || Number.isNaN(value)) return;
            const pct = value / 100;
            expression = pct.toString();
            lastResult = "";
          } catch (e) {
            lastResult = "Error";
          }
        }

        function handleKey(value, type) {
          switch (type) {
            case "number":
              appendNumber(value);
              break;
            case "operator":
              appendOperator(value);
              break;
            case "decimal":
              appendDecimal();
              break;
            case "action":
              if (value === "clear") {
                expression = "";
                lastResult = "";
              } else if (value === "backspace") {
                expression = expression.slice(0, -1);
              } else if (value === "equals") {
                calculate();
              } else if (value === "percent") {
                percent();
              }
              break;
          }
          updateDisplay();
        }

        buttons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const number = btn.getAttribute("data-number");
            const operator = btn.getAttribute("data-operator");
            const decimal = btn.getAttribute("data-decimal");
            const action = btn.getAttribute("data-action");

            if (number !== null) {
              handleKey(number, "number");
            } else if (operator !== null) {
              handleKey(operator, "operator");
            } else if (decimal !== null) {
              handleKey(decimal, "decimal");
            } else if (action !== null) {
              handleKey(action, "action");
            }
          });
        });

        // Keyboard support
        window.addEventListener("keydown", (e) => {
          const key = e.key;
          if (/\d/.test(key)) {
            handleKey(key, "number");
          } else if (key === ".") {
            handleKey(".", "decimal");
          } else if (["+", "-", "*", "/"].includes(key)) {
            const map = { "*": "×", "/": "÷" };
            handleKey(map[key] || key, "operator");
          } else if (key === "Enter" || key === "=") {
            e.preventDefault();
            handleKey("equals", "action");
          } else if (key === "Backspace") {
            handleKey("backspace", "action");
          } else if (key.toLowerCase() === "c") {
            handleKey("clear", "action");
          } else if (key === "%") {
            handleKey("percent", "action");
          }
        });

        updateDisplay();
      })();