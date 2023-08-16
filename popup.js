const settingsChange = async function (setting, state, urlCertain = false) {
    console.log(setting);
    console.log("hehex" + urlCertain + "hehehe");

    if (!urlCertain) {
        // First, retrieve the existing settings
        await chrome.storage.sync.get(["settings"], function(result) {
            const existingSettings = result.settings || {};
            existingSettings[setting] = state; // changes the certain setting
    
            // Save the updated settings back to storage
            chrome.storage.sync.set(
                {
                    "settings": existingSettings
                },
                () => {
                    console.log("Setting saved");
                }
            );
        });   
    } else {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = new URL(await tabs[0].url);
        const cURL = url.hostname;

        // Use async/await to retrieve and update the settings
        let existingURLPart = await chrome.storage.sync.get([cURL]);
        existingURLPart = existingURLPart[cURL] || {};
        const existingSettings = existingURLPart["settings"] || {};
        existingSettings[setting] = state;

        existingURLPart["settings"] = existingSettings;

        // Save the updated settings back to storage
        chrome.storage.sync.set(
            {
                [cURL]: existingURLPart
            },
            () => {
                console.log("URL specific Setting saved");
                console.log(existingSettings);
            }
        );
    }

    (() => {
        // Sending a message to the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            
            if (activeTab) {
                chrome.tabs.sendMessage(activeTab.id, { "type": "SETTINGS", "setting": setting, "state": state });
            }
        });
    })();
};

const loadSettingsStates = function (url) {
    chrome.storage.sync.get(["settings", url], function (result) {
        // global settings
        const settings = result.settings;
        console.log(settings);
        for (const key in settings) {
            console.log((key))
            document.getElementById(key).checked = settings[key];
        }

        // url specific settings
        const urlResults = result[url] || {};
        console.log(result)
        const urlSettings = urlResults["settings"] || {};
        console.log(urlSettings);
        for (const key in urlSettings) {
            console.log((key))
            document.getElementById(key).checked = urlSettings[key];
        }
    });
};

const changeEventHandlerToSwitch = function (arr) {
    arr.forEach(element => {
        console.log(element.id);
        element.addEventListener('change', () => {
            settingsChange(element.id, element.checked)
        });
    });
};

const changeEventHandlerToSwitchURL = function (arr) {
    arr.forEach(element => {
        element.addEventListener('change', () => {
            settingsChange(element.id, element.checked, true);
        });
    });
};

document.addEventListener("DOMContentLoaded", function () {
    // global settings
    const settings_inputs = document.getElementsByClassName("settings_checkbox");
    changeEventHandlerToSwitch(Array.from(settings_inputs));

    // url settings
    const urlSettings_inputs = document.getElementsByClassName("settings_checkbox_url");
    changeEventHandlerToSwitchURL(Array.from(urlSettings_inputs));

    (async () => {
        console.log(await chrome.storage.sync.get());

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = new URL(await tabs[0].url);
        const cURL = url.hostname;

        // cURL = current url
        loadSettingsStates(cURL);
    })();
});

