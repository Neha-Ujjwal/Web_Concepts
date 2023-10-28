const fetchApi = fetch(
  "https://api.weatherapi.com/v1/forecast.json?key=f742d06a81ec4843908103609231910&q=america&days=1"
);

//fetch returns a promise

fetchApi
  .then((response) => {
    return response.json(); //this also returns a promise
  })
  .then((data) => {
    console.log(data); //here we are printing the data returned by promise
  });

//promise is basically an object that eventually filed with completion or failure of a asynchronous task.

//there are mainly 2 drawbacks of callback ->callback Hell, Inversion if control

//when js engine executes the `const fetchApi=fetch("")` this line it creates an promise object fetchApi with
//state pending and promiseResult undefined as soon as asynchronous task is completed this object is filled with returned value and after this
// callback (.then()  or .catch())function will be called by promises.
//till this all remaining commands will be executed by js engine.

//how promises solve callbacks drawbacks
//promises gurantess that execution of callbacks .then() .catch()
//  must take place and it will be executed only once and data which will be returned by promise will be immutable.

//two properties of promises->promiseState(pending,fulfilled,rejected) and promiseResult(data or error)

//also in promises unlike callacks we are not passing callback function to another function which might be risky

//Recap

// 1. Before promise we used to depend on callback functions which would result in 1.) Callback Hell (Pyramid of doom) | 2.) Inversion of control
// 2. Inversion of control is overcome by using promise.
//   2.1) A promise is an object that represents eventual completion/failure of an asynchronous operation.
//   2.2) A promise has 3 states: pending | fulfilled | rejected.
//   2.3)  As soon as promise is fulfilled/rejected => It updates the empty object which is assigned undefined in pending state.
//   2.4) A promise resolves only once and it is immutable.
//   2.5) Using .then() we can control when we call the cb(callback) function.

// 3. To avoid callback hell (Pyramid of doom) => We use promise chaining. This way our code expands vertically instead of horizontally. Chaining is done using '.then()'
// 4. A very common mistake that developers do is not returning a value during chaining of promises. Always remember to return a value. This returned value will be used by the next .then()

//our own custom promise

function createOrder(cart) {
  const promiseObj = new Promise((resolve, reject) => {
    if (!validatecart(cart)) {
      reject(new Error("cart is not validated!!!!")); //rejecetd the promise
    }

    const orderId = "12344"; //here we make database call to retrieve orderId
    resolve(orderId);
  });
  return promiseObj;
}

//error handling and resolving promises

// function validateCart(cart){return false;}
// function createOrder(cart) {
//   const promiseObj = new Promise((resolve, reject) => {
//     if (!validateCart(cart)) {
//       reject(new Error("cart is not validated!!!!")); //rejecetd the promise
//     }

//     const orderId = "12344"; //here we make database call to retrieve orderId
//     setTimeout(()=>{
//         resolve(orderId);
//     },5000);
//   });
//   return promiseObj;
// }

// const result=createOrder(["shoes"]);
// result.then((data)=>{
//   console.log(data);
// })
// .catch((err)=>{
//   console.log("invalid request!!!!");
// })

/**********   ASYNC AND AWAIT **********/

//async function will always return a promise .if we return promise by ourself then it is okay but suppose
// if we return a string(or aother thing) then automatically it will wrap it in a promise

async function getData() {
  return "promise";
}

const promiseData = getData();
// console.log(promiseData);
promiseData.then((res) => console.log(res)); //.then() method will give you value(i.e.data) when the promise is fulfilled/successfull

//async and await are used to handle promises
//we use await in front of promise that has to be resolved to get its value like .then() methpd
//await can only be used inside async function

let p = new Promise((resolve, reject) => {
  resolve("async resolved value");
});

async function getData() {
  const val = await p;
  console.log(val); //this will print async resolved value
}
getData();

//dfiffernce between handling promises using async await and normal method

//when we use aait js engine will wait till the promise is resolved only after this it will move to next line and execute this
//but in normal function/promises it will execute next lines and when it will have promise value then it will print that here js engine will not wait for promise to be resolved

//js engine appears to wait but it is actually not waiting
p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("async resolved value");
  }, 10000);
});
async function getData() {
  console.log("hello"); //this line will be printed immediately
  const val = await p;
  console.log(val);
  console.log("javascript"); //this line will be printed after the promise is resolved i.e. 10 s in this case
}

getData();

async function A() {
  setTimeout(() => {
    console.log("A function");
  }, 5000);
}

async function B() {
  setTimeout(() => {
    console.log("B function");
  }, 2000);
}
async function fetchData2() {
  const ans = await A();
  const ans2 = await B();
  console.log("hello"); //here hello will be printed immediately although we used await with async function A and B
  console.log(ans);
}

fetchData2();

//reason is we know async function alwaqys return a promise irrespectively of whetehr we are returning promise or not inside it
//so when the execution goes to async function A() it will return a promise immediately with state->fulfilled and promiseresult->undefined
//because there is nothing to wait here setTimeout() function will be excuted after 5 sec but it has no refernce with promise resovlement
//setTimout funtion will be moved to callback queue ans it will be excuted after 5 sec

//so function A() return a promise immediately similarly function will also retrun a promise iommediately
//hence we are not returning promises from function A and B so await keyword dont work i.e. it will wait for anything (execution will not stop)
//hence hello will be printed immediately and A() B() function setTimeOut will be called after their respective times  and then console statements will be printed
//here we are also printing ans variable as promiseResult is undefined so it will print undefined immediately after printing hello.

//but if we used below written code then as we are rerurnig  promise in A()
//function here the program will wait till Promise is resolved and then execute other js lines
//here hello will be printed after 5 sec and ans variable also has resolved value i.e A resolved in this case
//so it will print A resolved
async function A() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("A function");
      resolve("A resolved");
    }, 5000);
  });
}

async function B() {
  setTimeout(() => {
    console.log("B function");
  }, 2000);
}
async function fetchData2() {
  const ans = await A();
  const ans2 = await B();
  console.log("hello");

  console.log(ans);
  // console.log(ans2 instanceof Promise );
  // setTimeout(()=>{
  //     console.log(ans);
  // },7000);
}

fetchData2();

//IN the below example all statemnts will be printed after 10 sec both that are below first await and that are below second await
//both promises are resolved after 10 sec. not 20 sec.

p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("async resolved value");
  }, 10000);
});

async function handelPromise() {
  const val = await p;
  console.log("hello1");
  console.log(val);

  val = await p;
  console.log("hello2");
  console.log(val);
}

//in gven example below after 10 sec all statemnts will be printed becasue first promise will be resolve
//after 10 sec and second promise which have setTimeout of 5 sec will be resolved in the time taken to resolve
//first promise so when first promise is resolved p2 already has been resolved so all statements will be executed
//so toatl it takes 10s not 15 sec

//but if we chnage setTimeout of p1 to 5s and p2 to 10 sec  then after 5 sec hello1 and val1 will be printed and
//as p2 has setTimeout of 10s so after another 5s hello2 and val2 will be printed.So total it takes 10 sec
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("async resolved value");
  }, 10000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("async resolved value");
  }, 5000);
});
async function handelPromise2() {
  const val1 = await p1;
  console.log("hello1");
  console.log(val1);

  const val2 = await p2;
  console.log("hello2");
  console.log(val2);
}

//js engine actually is not waiting for promise to be resolved
//first it will put handlePromise2() function in the call stack as soon as js engine sees await statement
//it will pop the function from the callStack and pushed it into again in the call stack whenever promise is resolved
//and it will start executing the fucntion from where it left

//in the meantime when call satck is empty it will execute rest of js code that is below  handlePromise2() function

/************HOW FETCH WORKS *************************/

//fetch is a promise so when promise is resolved it will give you a response Object and
//this response Object has a body which is a readable stream and to convert this readable stream
//to json we have to do Response.json() and Response.json() is again a promise and when this promise
//is resolved it will give you a value

//FETCH() => RESPONSE => RESPONSE.JSON()

const API_URL = "https://api.github.com/users/akshaymarch7";
// await can only be used inside an async function
async function handlePromise() {
  const data = await fetch(API_URL);
  const jsonValue = await data.json();
  console.log(jsonValue);
}
handlePromise();

//error handling in async await in promises we have .catch() method to handle error
//here we have try-catch block to handle errors

async function handlePromise() {
  try {
    const data = await fetch(API_URL);

    const jsonValue = await data.json();
    console.log(jsonValue);
  } catch (error) {
    console.log(error);
  }
}
handlePromise();

//or by below method as async dunction alsways returns a promise sow e can use catch method

async function handlePromise() {
  const data = await fetch(API_URL);
  const jsonValue = await data.json();
  console.log(jsonValue);
}
handlePromise().catch((err) => console.log(err));

//async await are just another way of writing promise.then().catch() .there is no major differnce
