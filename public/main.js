const input = document.querySelector('input')
const btn = document.querySelector('#addBtn')
const   mainRow = document.querySelector('#main-row')

btn.addEventListener('click', function(){ //na klik event
    let inputVal = input.value
    let xml = new XMLHttpRequest()
    xml.open('post', '/save')
    xml.onreadystatechange = function () {
        if(xml.readyState == 4 && xml.status == 200) { //statusna poruka
            console.log(xml.responseText) //server vraca poruku na osnovu podataka koje je korisnik upisao
            displayTodos() //cim stigne neka nova "TODO", pozovi funkciju displayTodos i prikazi - vrlo vazno za SPA. Ponovo ce se isprazniti nasa text varijabla i sve poceti iz pocetka
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json') //govorimo koji tip je podataka kako bi server mogao da iskoristiti te podatke (JSON)
    xml.send(JSON.stringify({msg : inputVal})) //saljemo podatke na server
})

function displayTodos() { //ova funkcija ce morati da komunicira sa nasim app.js serverom. Da bi to uradili potreban nam je xml http req, medjutim ovaj put to cemo uraditi preko promisa. Promise zahtjeva callback f-ju. Ovaj put smo koristili promise, zato sto je nasa varijabla data ustvari promise, tj obecanje da ce podaci biti dostavljeni i kad se dostave podaci tj ako se resolvira, onda (then) uradi sljedece tj. uradi nesto. (prikazi todo)
    let data = new Promise((resolve,reject)=> {
        let xml = new XMLHttpRequest()
        xml.open('get', '/get_data')//kada ovaj zahtjev pogodi ovu rutu, mi cemo dobiti nazad podatke
        xml.onreadystatechange = function() {//slusamo kada stizu podaci od servera
            if(xml.readyState == 4 && xml.status == 200) {//ako su stigli podaci tada rjesavamo nas promise sa resolve i uvijek se resolve razrjesava sa samim podacima (value-om), tj ono sto smo dobili nazada od servera. I kada se ovaj resolve razrjesi, onda ce se pokrenuti funkcija then.
                resolve(JSON.parse(xml.responseText))
            }
        }
        xml.send()
    })
    data.then((data)=>{//kada stignu podaci, pokreni ovu f-ju
        console.log(`podaci od resolva: ${JSON.stringify(data)}`) //konzoluje razrjesene data podatke iz servera i baze
        let text = "";
        for (let i = 0; i < data.length; i++) {//lupujemo kroz nase podatke
            text+=//popunjavamo nasu varijablu 
            `
            <div class="col-4">
            <div class="card m-2">
                <div class="card-header">
                    <button class="btn btn-sm btn-secondary float-left">Todo: ${i + 1}</button>
                    <button class="btn btn-sm btn-success float-right">${data[i].date}</button>
                </div>
                <div class="card-body text-center">
                    <h4>${data[i].msg}</h4>
                </div>
                <div class="card-footer text-center">
                    <button data-id="${data[i]._id}" class="btn-warning btn-sm">Delete</button>
                </div>
            </div>
        </div>
            `
            //kada se zavrsi ovaj loop mi mozemo da ubacimo ove podatke u neki div npr nas row
        }
        mainRow.innerHTML = text //dodjeljujemo obradjene podatke (karticu) u nas row div element kojeg smo preko id ubacili u js
        let allDeleteBtns = document.querySelectorAll('[data-id]')
        //putem JS poziva sve delete buttone nakon sto smo poslali podatke u main-row buduci da su nam tek nakon toga buttoni dostupni
        for(let i = 0; i < allDeleteBtns.length; i++) {
            allDeleteBtns[i].addEventListener('click', deleteTodo) //za svaki delete button dodajemo funkciju na event click
        }
    }) 
}

displayTodos()

function deleteTodo() {
    //moramo poslati novi http request serveru da obrise odredjeni todo
    let xml = new XMLHttpRequest()
    xml.open('post', '/delete')
    xml.onreadystatechange = function() {
        if(xml.readyState == 4 && xml.status == 200) {
            displayTodos() //pozovi odmah funkciju za displaj cim dobiemo odgovor od servera tj cim obrisemo neki todo
        }
    }
    xml.setRequestHeader('Content-Type', 'application/json')
    xml.send(JSON.stringify({id: this.getAttribute('data-id')})) //saljemo id od buttona serveru na delete, this nam sluzi da odaberemo bas to dugme nad kojim se vrsi operacija. Kada kliknemo na to dugme, uzimamo atribut data-id, stavljamo u object i posaljemo na server. Server ce uzeti taj id, otici do baze i obrisati bas taj id
}