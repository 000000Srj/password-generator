const inputSlider = document.querySelector("[data-lengthSlider]");
//you can you this like this to fetch by custom attribute^
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
//it will take every element of type checkbox from html^
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'; // string of symbols to help in generating random symbols


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;// 0 checkbox is initially ticked
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    //the work of this function is to reflect password length to ui
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;//displaying length is marked equal to password length
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    //to set the height and width of slider (passwordLength - min)*100/(max - min)) + "% this will set the height and 100%" this will set the width

    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"

}

function setIndicator(color) {
    //set input parameter color to strength indicator
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;//this is to add shadow
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //generate random integer between 0 to max-min and +min will start from min except for 0 to that number
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))//return String.fromCharCode this will convert integer to character using ASCII value
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true; //if uppercaseChecked is checked then make hasUpper true
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);//we can copy any value to clipboard using this method and this will return a promise
        copyMsg.innerText = "copied";// if copied then show copied to data-Copymsg custom attribute tag
    }
    catch(e) {
        //if not copied and get any error then to handle that error we will use this catch block
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active"); 

    setTimeout( () => {
        //to make it invisible after 2 sec
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    //we can use this method to suffle an array
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)//if checkbox is checked then increment the checkcount
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        //if this condition then change passwordlength to checkcount value
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {//for each checkbox
    checkbox.addEventListener('change', handleCheckBoxChange);//when no. of checkbox changed call handlecheckbox function
})


inputSlider.addEventListener('input', (e) => {//input is the event and e is value changed in input event
    passwordLength = e.target.value; //passwordLength equals to the new input value
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();//function call funcarr
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));//from password make array
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});