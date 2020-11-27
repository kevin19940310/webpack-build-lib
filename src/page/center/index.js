/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import "./index.css";
import "./index.ts";
import React from "react";
import ReactDom from "react-dom";
import sayName from "../../util/util";

import imgsrc from "../../images/1.png";

sayName("yanGe");
const add = (a, b) => a + b;

const a = 2;
const b = 3;
console.log(add(a, b));

ReactDom.render(
  <>
    <img src={imgsrc}></img>
    <h1>hello, world</h1>
  </>,
  document.getElementById("root")
);
