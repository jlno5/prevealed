(() => {
    let passwordFields = [];

    const revealPasswordFields = function () {
        passwordFields = document.querySelectorAll('input[type="password"]');

        passwordFields.forEach(originalInput => {
            originalInput.setAttribute("type", "text");
        });
    };

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

    document.addEventListener('DOMContentLoaded', revealPasswordFields);

    chrome.runtime.onMessage.addListener(function (obj, sender, response) {
        const type = obj.type;

        console.log(type);

        if (type == "NEW") {
            revealPasswordFields();    // also called at side refreshes
        }

        if (type == "SETTINGS") {
            console.log(obj.setting + " " + obj.state)
            if (!obj.setting) return;
            try {
                switch (obj.setting) {
                    case "reveal_all_passwords_this_side_permanent":
                    case "reveal_all_passwords_globaly":
                        if (obj.state) revealPasswordFields();
                        else hidePasswordFields();
                        break;
                    default:
                        console.log("default hitted")
                        break;
                }
            } catch (error) {
                console.log(error)
            }
            
        }

    });

})();
