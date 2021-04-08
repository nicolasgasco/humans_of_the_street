function capitalizeFirstLetterEveryWord(myString) {
    myString = myString.split(" ").map( el => el.charAt(0).toUpperCase() + el.substring(1).toLowerCase()).join(" ");
    myString= myString.split("-").map( el => el.charAt(0).toUpperCase() + el.substring(1)).join("-")

    return myString.trim();
}


function capitalizeFirstCharLeaveRestSame(myString) {
    myString = myString.trim();
    let result = myString.charAt(0).toUpperCase() + myString.substring(1);
    return result;
}


function createObjectFromString(arrayToParse) {
    let stringToParse = `{${arrayToParse.join(", ")}}`;
    let result = JSON.parse(stringToParse);
    return result;
}


function getIdCurrentUser() {
    fetch("/api/currentuser/")
    .then( res => res.json() )
    .then( res => {

        return res.results._id;

    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


function sendNewStoryToDB(event) {
    // event.preventDefault();

    let newStory = {    };

    // Necessary to build the object
    let fromArr = [];
    let currentArr = [];
    let interview = [];
    let contact = [];

    for ( let inputField of newStoryForm.children ) {
        if ( inputField.tagName !== "LABEL" && inputField.tagName !== "P" ) {

            // Data validation
            let validatedData;
            if ( inputField.value ) {
                

                if ( inputField.name === "gender" ) {
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "img" ) {
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "spot" || inputField.type === "textarea" ) {
                    validatedData = capitalizeFirstCharLeaveRestSame(inputField.value);

                } else if ( inputField.type === "text" ) {
                    validatedData =  capitalizeFirstLetterEveryWord(inputField.value); 
                }

                let value = validatedData || inputField.value;



                switch ( inputField.name ) {
                    case "city-from":
                        fromArr.push( `"city": "${value}"` );
                        break;
    
                    case "country-from":
                        fromArr.push( `"country": "${value}"` );
                        break;
    
                    case "city":
                        currentArr.push( `"city": "${value}"` );
                        break;
    
                    case "country":
                        currentArr.push( `"country": "${value}"` );
                        break;
    
                    case "story":
                        interview.push( `"story": "${value}"` );
                        break;
    
                    case "advice":
                        interview.push( `"advice": "${value}"` );
                        break;
                    
                    
                    case "dream":
                            interview.push( `"dream": "${value}"` );
                        break;
    
                    case "spot":
                        newStory["where_to_find"] = { "spot": value };
                        break;
    
                    case "telephone":
                        contact.push( `"telephone_number": "${value}"` );
                        break;
                    
                    case "email":
                        contact.push( `"email": "${value}"` );
                        break;
    
                    default:
                        newStory[inputField.name] = value;
                        break;
                }
                
            }


        }
    }

    const shareConsent = document.querySelector(`input[name="share-consent"]:checked`).value;
    contact.push( `"share_contact": ${Boolean(shareConsent)}` );


    newStory["submitDate"] = new Date();

    if ( fromArr.length > 0 ) {
        console.log(createObjectFromString(fromArr))
        newStory["from"] = createObjectFromString(fromArr);
    } 

    if ( currentArr.length > 0 ) {
        newStory["currently_in"] = createObjectFromString(currentArr);
    } 

    if ( interview.length > 0 ) {
        newStory["interview"] = createObjectFromString(interview);
    } 

    // contact = `{${contact.join(", ")}}`;
    // contact = JSON.parse(contact);
    newStory["contact"] = createObjectFromString(contact);

    updateStory["submittedBy"] = getIdCurrentUser();
    
    fetch("api/humans", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStory),
    })
    .then(response => response.json())
    .then( info => {

        const intervieweeInfoTitle = document.querySelector("#interviewee-info-title");
        const newStoryFormContainer = document.querySelector("#new-story-form-container");
        intervieweeInfoTitle.innerText = `New story submitted`;

        newStoryFormContainer.innerHTML =
        `
        <p>Your story was successfully submitted. It will be reviewed by an admin before publication.</p>
        <div class="add-button-container">
            <a href="./index.html"><button class="home-paragraph-button black-bg white-text bold">Back to home</button></a>
            <a href="./add.html"><button class="home-paragraph-button black-bg white-text bold">New story</button></a>
        </div>
        `








    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


const newStoryForm = document.querySelector("#new-story-form");
const submitStoryButton = document.querySelector("#submit-new-story");
submitStoryButton.addEventListener("click", sendNewStoryToDB);
