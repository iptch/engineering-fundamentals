import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

    // Diese Funktion wird nirgendwo importiert!
    export function calculateObsoleteTax(amount: number): number {
        return amount * 0.19;
    }

  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </div>
  );
}

export default Counter;
