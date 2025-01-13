
function copyToClipboard(elementId)
 {
     const textToCopy = document.getElementById(elementId).innerText;

    navigator.clipboard.writeText(textToCopy).then(() => 
    { 
       alert("Copied to clipboard!");                          //needs improvement 
    
    }).catch((err) => {
        console.error("Failed to copy: ", err);
    });
}

