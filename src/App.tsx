import React, { useReducer, createRef, useRef } from "react";

import { Disc, DisabledDisc } from "./disc";

import "./App.css";

class Stack {
  public stack: number[];

  constructor(init: number[]) {
    this.stack = init;
  }
  get top() {
    return this.stack[0];
  }
  add(item: number) {
    if (!(item > this.top)) {
      this.stack.unshift(item);
      return true;
    }
    return false;
  }
  remove() {
    return this.stack.shift();
  }
}

const initialState = [new Stack([1, 2, 3, 4, 5]), new Stack([]), new Stack([])];

const size = initialState[0].stack.length;

function App() {
  const [poles, dispatch] = useReducer(reducer, initialState);

  const complete =
    poles[1].stack.length === size || poles[2].stack.length === size;

  const refs = useRef(poles.map(() => createRef<HTMLDivElement>()));

  return (
    <>
      <div className="App">
        {poles.map((pole, i) => (
          <div ref={refs.current[i]} key={i} className="pole">
            {pole.stack.map(item =>
              item === pole.top ? (
                <Disc
                  pole={i}
                  key={item}
                  index={item}
                  dispatch={dispatch}
                  parent={refs.current[i]}
                />
              ) : (
                <DisabledDisc key={item} index={item} />
              )
            )}
          </div>
        ))}
      </div>
      {complete ? (
        <button
          className="button"
          onClick={() => {
            window.location.reload();
          }}
        >
          You Won
        </button>
      ) : null}
    </>
  );
}

function reducer(
  prevState: Stack[],
  { item, from, to }: { item: number; from: number; to: number }
) {
  if (to > -1 && to < prevState.length && prevState[to].add(item)) {
    prevState[from].remove();
    return [...prevState];
  }

  return prevState;
}

export default App;
