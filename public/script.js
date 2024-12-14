function copyToClipboard(elementId)
 {
    const textToCopy = document.getElementById(elementId).innerText;

    navigator.clipboard.writeText(textToCopy).then(() => { //needs improvement 
        alert("Copied to clipboard!");
    
    }).catch((err) => {
        console.error("Failed to copy: ", err);
    });
}