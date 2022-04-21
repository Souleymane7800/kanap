//------Gestion du panier sur la page "cart"
//Récupération des données du local storage
let itemPicked = JSON.parse(localStorage.getItem('itemPicked'));
console.log(itemPicked);

//Si le panier est vide on affiche:"Votree panier est vide"
if ( itemPicked === null || itemPicked.length === 0) {
    let emptyCart = document.querySelector('h1');
    emptyCart.innerText = "Votre panier est vide !";
    document.querySelector('#totalQuantity').innerText = "0";
    document.querySelector("#totalPrice").innerText = "0"
} else {
         
    //Afficher pour chaque produit du panier
    for (let i = 0; i < itemPicked.length; i++) {
        let url = `http://localhost:3000/api/products/${itemPicked[i].id}`;
        
        //Envoyer une requête HTTP pour récupérer les données
        fetch(url).then(function(res) {
            if (res.ok) {
                return res.json();
            }
        }).then(function(data) {
            
            //Inssertion de la balise article et de ses composantes
            function insertContent(data) {
                let article = document.createElement('article');
                document.querySelector('#cart__items').appendChild(article);
                article.setAttribute('class', 'cart__item');
                article.setAttribute('data-id', `${itemPicked[i].id}`);
                article.setAttribute('data-color', `${itemPicked[i].color}`);
                article.innerHTML = 
                `<div class="cart__item__img">
                <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${data.name}</h2>
                <p>${itemPicked[i].color}</p>
                <p class="cart__item__content__price">${data.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemPicked[i].quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
                </div>
                </div>`;
            };
            insertContent(data);
            
            //Fonction pour modifier la quantité
            function changeQty() {
                let input = document.querySelectorAll('.itemQuantity'); //NodeList
                let i = input.length-1;
                
                input[i].addEventListener('change', function() {
                    if (this.value <= 0) {
                        this.value = 0;
                        itemPicked.splice(i, 1);
                    } else if (this.value > 100) {
                        this.value = 100;
                        itemPicked[i].quantity = this.value;
                    } else {
                        itemPicked[i].quantity = this.value;
                    }
                    localStorage.setItem('itemPicked', JSON.stringify(itemPicked));
                    location.reload();
                })
            };
            changeQty();
            
            //Fonction pour supprimer un article quand on clique sur "Supprimer"
            function deleteItem() {
                let deleteButton = document.querySelectorAll('.deleteItem'); //deleteButton = NodeList
                let i = deleteButton.length-1;
                
                deleteButton[i].addEventListener('click', function() {
                    itemPicked.splice(i, 1);
                    localStorage.setItem('itemPicked', JSON.stringify(itemPicked));
                    location.reload();
                });
            };
            deleteItem();
            
            //Fonction pour calculer le prix total
            function cartTotalPrice() {
                let articlePrice = document.querySelectorAll('.cart__item__content__price');
                let totalPrice = 0;
                for (let j = 0; j < itemPicked.length; j++) {
                    let itemUnitPrice = articlePrice[j].textContent.split('€')[0];
                    let quantity = itemPicked[j].quantity;
                    let itemTotalPrice = Number(quantity) * Number(itemUnitPrice);
                    totalPrice += itemTotalPrice;
                }
                document.querySelector('#totalPrice').innerText = totalPrice;
            };
            cartTotalPrice();
            
            //Fonction pour calculer le nombre total d'articles dans le panier
            function cartTotalQty() {
                let finalQty = 0;
                for (let i = 0; i < itemPicked.length; i++) {
                    finalQty += Number(itemPicked[i].quantity);
                };
                document.querySelector('#totalQuantity').innerText = finalQty;
            };
            cartTotalQty();
            
        }).catch(function(err) {
            console.log('Une erreur est survenue : ' + err);
        });
    };
        
    //Tableau pour récupérer les id des produits du panier
    const products = [];
    for (let i = 0; i < itemPicked.length; i++) {
        let idEntry = [`${itemPicked[i].id}`];
        localStorage.setItem('idEntry', JSON.stringify(idEntry));
        products.push(idEntry);
    }
        
    // Remplissage du formulaire avec vérification Regex
    function sendToForm() {
        
        // Ecoute du clique sur le bouton commander "order"
        let order = document.getElementById("order");
        order.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Mettre les données de contact dans un objet
            const contact = {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value,
            };

            console.log(contact);
            
            // REGEX "firstName" avec validation de l'input
            function formFirstName() {
                const validFirstName = contact.firstName;
                let regExpFirstName =
                /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,25}$/.test(validFirstName);
                if (regExpFirstName) {
                    document.querySelector("#firstNameErrorMsg").innerHTML = "";
                    return true;
                } else {
                    let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
                    firstNameErrorMsg.innerHTML =
                    "Veuillez entrer votre prénom, compris entre 3 et 25 caractères";
                }
            }
            
            // REGEX "lastName" avec validation de l'input
            function formLastName() {
                const validLastName = contact.lastName;
                let regExpLastName =
                /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,25}$/.test(validLastName);
                if (regExpLastName) {
                    document.querySelector("#lastNameErrorMsg").innerHTML = "";
                    return true;
                } else {
                    let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
                    lastNameErrorMsg.innerHTML =
                    "Veuillez entrer votre nom, compris entre 3 et 25 caractères";
                }
            }
            
            // REGEX "address" avec validation de l'input
            function formAddress() {
                const validAddress = contact.address;
                let regExpAddress =
                /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(
                    validAddress
                );
                if (regExpAddress) {
                    document.querySelector("#addressErrorMsg").innerHTML = "";
                    return true;
                } else {
                    let addressErrorMsg = document.getElementById("addressErrorMsg");
                    addressErrorMsg.innerHTML = "Veuillez entrer une addresse valide.";
                }
            }
            
            // REGEX "city" avec validation de l'input
            function formCity() {
                const validCity = contact.city;
                let regExpCity =
                /^[a-zA-Zàâäéèêëïîôöùûüç]+(?:[- ][a-zA-Zàâäéèêëïîôöùûüç]+)*$/.test(
                    validCity
                    );
                    if (regExpCity) {
                        document.querySelector("#cityErrorMsg").innerHTML = "";
                        return true;
                    } else {
                        let cityErrorMsg = document.getElementById("cityErrorMsg");
                        cityErrorMsg.innerHTML = "Veuillez entrer un nom de ville valide.";
                    }
                }

                // REGEX "email" avec validation de l'input
                function formEmail() {
                    const validEmail = contact.email;
                    let regExpEmail =
                    /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(
                        validEmail
                        );
                        if (regExpEmail) {
                            document.querySelector("#emailErrorMsg").innerHTML = "";
                            return true;
                        } else {
                            let emailErrorMsg = document.getElementById("emailErrorMsg");
                            emailErrorMsg.innerHTML = "Veuillez entrer une addresse email valide.";
                        }
                }

                // Si tous les champs sont valide,
                //  créer un objet "contact" dans le local storage
                function formValidation() {
                        
                    if (
                        formFirstName() === true &&
                        formLastName() === true &&
                        formAddress() === true &&
                        formCity() === true &&
                        formEmail() === true
                    ) {
                        localStorage.setItem("contact", JSON.stringify(contact));
                        return true;
                    } else {
                        event.preventDefault();
                        alert("Merci de remplir correctement le formulaire");
                    }
                }
                                        
                // Création d'un array dans le local storage à envoyer au serveur
                    let products = [];
                    for (let i = 0; i < products.length; i++) {
                        products.push(products[i].idProduct);
                    }
                        
                    console.log(products);
                        
                    // Mettre "contact" et "products" dans un objet
                        if (formValidation() === true) {
                            
                            const order = {
                                contact,
                                products,
                            };
                            
                            fetch("http://localhost:3000/api/products/order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(order),
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(data);
                                localStorage.clear();
                                localStorage.setItem("orderId", data.orderId);
                                document.location.href = "confirmation.html";
                            })
                            .catch((error) => console.log(error));
                        } else {
                            event.preventDefault();
                        }
        });
    }
    sendToForm();
}