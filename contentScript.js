(() => {
    let passwordFields = document.querySelectorAll('input[type="password"]');
    console.log(passwordFields)
    console.log("passwordFields")
    // document.addEventListener('DOMContentLoaded', revealPasswordFields);


    function revealPasswordFields () {
        console.log("the revealPasswordField function is running");
        passwordFields.forEach(originalInput => {
            originalInput.setAttribute("type", "text");
            console.log("found a new password field");
        });
    }

    const hidePasswordFields = function () {
        passwordFields.forEach(originalInput => {
            originalInput.setAttribute("type", "password");
        });
    };

    const addCopyImage = function () {
        // Create an img element
        var imageElement = document.createElement('img');
        imageElement.src = chrome.runtime.getURL('assets/copy.svg'); // Replace with the actual path to your image
        imageElement.style.verticalAlign = 'middle'; // Align the image vertically
        imageElement.setAttribute("position", "relative");

        var styles = 
            `
            input {
                width:100%;
            }

            .input-image {
                height:15px;
                position:absolute;
                right:0;
                top:5px;
            }      
            `
        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)

        // Get a reference to the input element
        var inputElement = document.querySelector('[formcontrolname="password"]');

        // Insert the image element before the input element
        inputElement.parentNode.insertBefore(imageElement, inputElement);

        inputElement.parentElement.classList += "input-container";

        // Adjust the padding of the input element to make space for the image
        inputElement.style.paddingLeft = '30px'; // Adjust the value as needed

        console.log("added the image");
        console.log(imageElement);
    }


    chrome.runtime.onMessage.addListener(function (obj, sender, response) {
        const type = obj.type;

        console.log(type);

        if (type === "NEW") {
            console.log(obj.current_base_url)
            if (obj.current_base_url && obj.current_base_url !== "") {
                chrome.storage.sync.get([obj.current_base_url], (result) => {
                    const existingURLPart = result[obj.current_base_url];
                    if (existingURLPart == undefined) return; // nothing set
                    if (existingURLPart.settings == undefined) return; // no settings
                    const settings = existingURLPart.settings;
                    // if (settings.reveal_all_passwords_this_site_permanent)
                });
            }
            revealPasswordFields();    // also called at site refreshes
            console.log(obj.passwordFields);
        }

        if (type === "SETTINGS") {

            console.log(obj.setting + " " + obj.state)
            if (!obj.setting) return;
            try {
                switch (obj.setting) {
                    case "reveal_all_passwords_this_site_permanent":
                    case "reveal_all_passwords_globaly":
                        console.log(obj.thisSidePasswordVisibility + " klsjadfl;kjsadlk;jfl;ksadjflkjsadlkf;jsalk;jdflk;jsadfl;kj")
                        if (obj.thisSidePasswordVisibility != undefined) {
                            if (obj.thisSidePasswordVisibility === false) {
                                hidePasswordFields();
                                break;
                            }
                            if (obj.thisSidePasswordVisibility === true) {
                                revealPasswordFields();
                                break;
                            }
                        }

                        if (obj.state) revealPasswordFields();
                        else {
                            hidePasswordFields();
                            console.log("hidePasswordFields")
                        }
                        break;
                    default:
                        console.log("you finally reached the default! That is bad :)")
                        break;
                }
            } catch (error) {
                console.log(error)
            }
            
        }

    });

})();
