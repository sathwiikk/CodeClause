const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("button"),

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        // selecting English by default as FROM language and Hindi as TO language
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        // adding options tag inside select tag
        tag.insertAdjacentHTML("beforeend", option); 
    }
});

exchageIcon.addEventListener("click", () => {
    // exchanging textarea and select tag values
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    // mymemory.translated.net/doc/spec.php -> API
    // It's a free API so, sometimes translated text may not be accurate.
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    // fetching api response and returning it with parsing into js obj
    // and in another then method receiving that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
             // if clicked icon has from id, copy the fromTextarea value else copy the toTextarea value
            if(target.id == "from") {
                // writeText() property writes the specified text string to the system clipboard.
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            // if clicked icon has from id, speak the fromTextarea value else speak the toTextarea value
            if(target.id == "from") {
                // SpeechSynthesisUtterance represents a speech request
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value; //setting utterance language to fromSelect tag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value; //setting utterance language to toSelect tag value
            }
            // speak the passed utterance
            speechSynthesis.speak(utterance);
        }
    });
});