function orderConfirmation() {
    
    // Le numéro de commande apparait uniquement sur la page web et le Local storage est vidé
    const idConfirm = document.querySelector("#orderId");
    idConfirm.innerHTML = localStorage.getItem("orderId");
    localStorage.clear();
}
  
orderConfirmation();
