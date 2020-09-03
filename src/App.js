import React from "react";
import { useMap } from "./hooks";

import "./styles.css";

const Button = ({ children, ...restProps }) => {
  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

const Component = React.memo(({ value, onDelete }) => (
  <div className="Component">
    A Component from {value}!&nbsp;
    <Button onClick={onDelete}>Delete</Button>
  </div>
));

const data = {
  one: {
    component: null
  },
  two: {
    component: null
  },
  three: {
    component: null
  },
  four: {
    component: Component
  },
  five: {
    component: Component
  }
};

export default function App() {
  const { values, remove, clear, reset, set } = useMap(data);

  const handleRemove = (key) => {
    remove(key);
  };

  const handleSet = (key) => {
    set(key, () => {
      return {
        component: Component
      };
    });
  };

  return (
    <div className="App">
      <h1>useMap</h1>
      <h2>Dynamically manipulate an object</h2>
      <div className="Actions">
        <Button onClick={clear}>Clear</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      <div className="Actions">
        {Object.keys(data).map((key) => {
          return (
            <Button
              key={`${key}_set`}
              onClick={() => {
                handleSet(key);
              }}
            >
              Set "{key}"
            </Button>
          );
        })}
        <Button onClick={() => handleSet(new Date().getTime())}>
          Set Random
        </Button>
      </div>
      {Object.keys(values).map((key) => {
        const RenderComponent = values[key]?.component;
        if (RenderComponent) {
          return (
            <RenderComponent
              value={key}
              key={`${key}_render`}
              onDelete={() => handleRemove(key)}
            />
          );
        }

        return null;
      })}
      <div className="Json">
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
}
