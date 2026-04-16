let productos=[
 {n:'Pastel chocolate',p:250,c:'pasteles',img:'images/postre1.jpg'},
 {n:'Pastel vainilla',p:240,c:'pasteles',img:'images/postre4.jpg'},
 {n:'Cupcakes',p:120,c:'cupcakes',img:'images/postre3.jpg'},
 {n:'Cupcakes premium',p:150,c:'cupcakes',img:'images/postre5.jpg'},
 {n:'Gelatina',p:100,c:'postres',img:'images/postre7.jpg'},
 {n:'Flan',p:130,c:'postres',img:'images/postre8.jpg'},
 {n:'Brownies',p:150,c:'postres',img:'images/postre9.jpg'},
 {n:'Cheesecake de fresa',p:180,c:'postres',img:'images/postre10.jpg'}
];
let cart=JSON.parse(localStorage.getItem('cart'))||[];
let categoriaActual='todos';
let busqueda='';

function render(){
 let filtrados=productos
 .filter(p => (categoriaActual==='todos'||p.c===categoriaActual))
 .filter(p => p.n.toLowerCase().includes(busqueda.toLowerCase()));

 if(filtrados.length===0){
 document.getElementById('productos').innerHTML="<div class='no-results'>😢 No se encontraron resultados</div>";
 return;
 }

 let html='';
 filtrados.forEach(p=>{
 html+=`<div class='card'>
 <img src='${p.img}'>
 <h3>${p.n}</h3>
 <p>$${p.p}</p>
 <button class='btn' onclick="add('${p.n}',${p.p}, this)">Agregar</button>
 </div>`;
 });

 document.getElementById('productos').innerHTML=html;
}

function filter(cat,btn){
 categoriaActual=cat;
 document.querySelectorAll('#cats button').forEach(b=>b.classList.remove('active'));
 btn.classList.add('active');
 render();
}

function buscar(txt){
 busqueda=txt;
 render();
}

function add(n,p,btn){
 cart.push({n,p});
 save();
 update();

 // animación carrito (rebote)
 let icon=document.getElementById('cartIcon');
 icon.classList.add('bounce');
 setTimeout(()=>icon.classList.remove('bounce'),300);

 // 🔥 animación volar
 let img = btn.parentElement.querySelector("img");
 let clone = img.cloneNode(true);

 let rect = img.getBoundingClientRect();
 let cartRect = icon.getBoundingClientRect();

 clone.classList.add("fly");
 clone.style.top = rect.top + "px";
 clone.style.left = rect.left + "px";

 document.body.appendChild(clone);

 setTimeout(()=>{
     clone.style.top = cartRect.top + "px";
     clone.style.left = cartRect.left + "px";
     clone.style.width = "10px";
     clone.style.height = "10px";
     clone.style.opacity = "0.5";
 },10);

 setTimeout(()=>clone.remove(),700);
}

function update(){
 let count = document.getElementById('cart-count');
 count.innerText = cart.length;

 count.classList.add("bump");
 setTimeout(()=>count.classList.remove("bump"),300);

 let list='';
 let total=0;

 cart.forEach((i,index)=>{
 list+=`<li>${i.n} - $${i.p} <button onclick="remove(${index})">❌</button></li>`;
 total+=i.p;
 });

 document.getElementById('cartItems').innerHTML=list;
 document.getElementById('total').innerText=total;
}

function remove(i){
 cart.splice(i,1);
 save();
 update();
}

function clearCart(){
 cart=[];
 save();
 update();
}

function toggleCart(){
    const cart = document.getElementById('cartBox');
    const overlay = document.getElementById('overlay');

    cart.classList.toggle('show');

    if(cart.classList.contains('show')){
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
}

function save(){
 localStorage.setItem('cart',JSON.stringify(cart));
}

function sendWhatsApp(){
 if(cart.length===0)return alert('Carrito vacío');

 let msg='Hola, quiero pedir:%0A';
 let total=0;

 cart.forEach(i=>{
 msg+=`- ${i.n} $${i.p}%0A`;
 total+=i.p;
 });

 msg+=`Total: $${total}`;

 window.open(`https://wa.me/527220000000?text=${msg}`);
}

update();
render();
// cerrar carrito al hacer clic fuera
document.addEventListener("click", function(e){
    const cart = document.getElementById("cartBox");
    const icon = document.getElementById("cartIcon");

    // si el carrito está abierto (con clase)
    if(cart.classList.contains("show")){
        // si el clic NO fue dentro del carrito ni en el icono
        if(!cart.contains(e.target) && !icon.contains(e.target)){
            cart.classList.remove("show");
        }
    }
});
document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        document.getElementById("cartBox").classList.remove("show");
        document.getElementById("overlay").style.display = "none";
    }
});