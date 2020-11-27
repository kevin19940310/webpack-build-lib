import React from 'react';

interface IProperties {
  name: string;
  age: number;
}

function App(properties: IProperties) {
  const { name, age } = properties;
  return (
    <div className="app">
      <span>{`Hello! I'm ${name}, ${age} years old.2`}</span>
    </div>
  );
}

export default App;
