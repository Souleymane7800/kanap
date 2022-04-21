//------Récupération de l'id du produit sélectionner via L'url
// Récupérer l'URL de la page courante dans une variable
let str = window.location.href;

//Récupérer l'identifiant du produit
let newUrl = new URL(str);
let itemId = newUrl.searchParams.get('id');

//Récupérer l'URL du produit
let url = `http://localhost:3000/api/products/${itemId}`;

// ------Injection du DOM-------
//Fonction pour insérer les informations du produit dans la page
function productDysplay(arrayData) {
    document.querySelector('.item__img').innerHTML = `<img src="${arrayData.imageUrl}" alt="${arrayData.altTxt}">`;
    document.querySelector('#title').innerText = `${arrayData.name}`;
    document.querySelector('#price').innerText = `${arrayData.price}`;
    document.querySelector('#description').innerText = `${arrayData.description}`;
    for (let i = 0; i < arrayData.colors.length; i++) {
        let option = document.createElement('option');
        document.querySelector('#colors').appendChild(option);
        option.setAttribute('value', `${arrayData.colors[i]}`);
        option.innerText = `${arrayData.colors[i]}`;
        console.log(option.value);
    };
}
console.log("Produit sélectionné affiché")

//Récupérer les données nécessaires à l'affichage de la page
fetch(url).then(function(res) {
    if (res.ok) {
        return res.json();
    }
}).then(function(data) {
    //Insérer les informations du produit dans la page
    productDysplay(data);
    //Envoyer les informations vers le panier en cliquant sur le bouton "Ajouter"
    document.querySelector('#addToCart').addEventListener('click', function() {
     
        let itemQty = document.querySelector('#quantity').value;
        let itemColor = document.querySelector('#colors').value;
             
        console.log(itemColor,itemQty);

        if(itemColor === "") {
            alert ("Veuillez choisir une couleur.")

        } else if(itemQty == 0) {
            alert ("Veuillez choisir une quantité comprise entre 1 et 100.")

        } else {
            addcart(data,itemColor,itemQty);
            alert('Votre article a été ajouté dans le panier');
            console.log(localStorage.itemPicked);
        }
    });
}).catch(function(err) {
    console.log('Une erreur est survenue : ' + err)
});

// ------Gestion du panier------
//Fontion pour stocker les informations dans localStorage
function addcart (arrayData,itemColor,itemQty) {

    //Créer le panier dans localStorage
    let itemPicked = JSON.parse(localStorage.getItem('itemPicked'));
    if (itemPicked == null) {
        itemPicked = [];
    }
    console.log(itemPicked);


    //Créer "fiche produit" pour sauvegarder dans le localStorage.cart
    
    let itemPrice = document.querySelector('#price').innerText;
    let cart = {
        id : `${arrayData._id}`,
        quantity : itemQty,
        color : itemColor,
    };
        
    localStorage.setItem('cart', JSON.stringify(cart));
    
    //Ajouter le produit dans le tableau stocké dans localStorage.cart
    let idValue = cart['id'];
    let colorValue = cart['color'];
    let qtyValue = cart['quantity']; //string

    if (localStorage.itemPicked == null) {
        itemPicked.push(cart);
    } else if (localStorage.itemPicked.includes(idValue) && localStorage.itemPicked.includes(colorValue)) {
        
        const select = document.getElementById("colors");
        for (color of arrayData.colors) {
            const newoption = document.createElement("option");
            newoption.setAttribute("value", color);
            newoption.innerText = color;
            select.appendChild(newoption);
        }
    
    } else {
        itemPicked.push(cart);
    }
    
    //Pour sauvegarder le nouveau panier
    localStorage.setItem('itemPicked', JSON.stringify(itemPicked));
}