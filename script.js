
function copyToClipboard(elementId, button) {
    const textToCopy = document.getElementById(elementId).innerText;
  
    navigator.clipboard.writeText(textToCopy).then(() => {
      
      button.classList.add("copied");
  
     
      setTimeout(() => {
        button.classList.remove("copied");
      }, 1000);
    }).catch((err) => {
      console.error("Failed to copy: ", err);
    });
  }


