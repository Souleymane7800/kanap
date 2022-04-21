// ------Récupération des données via l'API------
//Variable contenant l'URL du catalogue Canapés
let url = 'http://localhost:3000/api/products';


//Envoyer une requête HTTP pour récupérer les données de l'API
fetch(url).then(function(res) {
    if (res.ok) {
        return res.json();
    }
}).then(function(data) {
    // console.log(data);
    articleDisplay(data);
}).catch(function(err) {
    console.log('Une erreur est survenue : ' + err);
});

// ------Injection du DOM------

//Fonction pour insérer chaque carte produit
function articleDisplay (arrayData) {
    for (let i = 0; i < arrayData.length; i++) {
        let a = document.createElement('a');
        document.querySelector('#items').appendChild(a);
        a.setAttribute('href', `./product.html?id=${arrayData[i]._id}`);
        a.innerHTML = 
            `<article>
                <img src="${arrayData[i].imageUrl}" alt="${arrayData[i].altTxt}">
                <h3 class="productName">${arrayData[i].name}</h3>
                <p class="productDescription">${arrayData[i].description}</p>
            </article>`
    }
    console.log("Liste produit affichée")
}