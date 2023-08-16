const settingsChange = async function (setting, state) {
    console.log(setting);
    // First, retrieve the existing settings
    await chrome.storage.sync.get(["settings"], function(result) {
        const existingSettings = result.settings || {};
        existingSettings[setting] = state;

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

    // Sending a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, { "type": "SETTINGS", "setting": setting, "state": state });
        }
    });
};

const loadSettingsStates = function () {
    chrome.storage.sync.get(["settings"], function (result) {
        let settings = result.settings;
        console.log(settings);
        for (const key in settings) {
            document.getElementById(key).checked = settings[key];
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
}

document.addEventListener("DOMContentLoaded", function () {
    let settings_inputs = document.getElementsByClassName("settings_checkbox");

    changeEventHandlerToSwitch(Array.from(settings_inputs));
    loadSettingsStates();
});

