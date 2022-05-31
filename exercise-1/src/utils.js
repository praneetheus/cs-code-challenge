function showDetails(currentNode) {
    currentNode.parentNode.nextElementSibling.classList.toggle("visible");
}
  
function setDefaultImg(currentNode) {
    currentNode.src="./src/assets/profile-blank.png";
    currentNode.onerror = "";
}