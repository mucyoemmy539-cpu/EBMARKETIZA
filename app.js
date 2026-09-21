const RATES={SEK:1,EUR:.086,USD:.100},SYMBOLS={SEK:"kr",EUR:"€",USD:"$"};
let currency=localStorage.getItem("eb_currency")||"SEK";
let favorites=JSON.parse(localStorage.getItem("eb_favorites")||"[]");
let cart=JSON.parse(localStorage.getItem("eb_cart")||"[]");
function money(v){return `${SYMBOLS[currency]} ${(v*RATES[currency]).toFixed(2)}`}
function save(){localStorage.setItem("eb_currency",currency);localStorage.setItem("eb_favorites",JSON.stringify(favorites));localStorage.setItem("eb_cart",JSON.stringify(cart))}
function counts(){const c=document.getElementById("cartCount"),f=document.getElementById("favoriteCount");if(c)c.textContent=cart.reduce((s,x)=>s+x.qty,0);if(f)f.textContent=favorites.length}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();counts();if(typeof renderHome==="function")renderHome()}
function addCart(id,qty=1,variant={}){const p=PRODUCTS.find(x=>x.id===id);if(!p||p.stock<1)return;const key=`${id}|${variant.color||""}|${variant.size||""}`;const item=cart.find(x=>x.key===key);if(item)item.qty=Math.min(item.qty+qty,p.stock);else cart.push({key,id,qty,color:variant.color||"",size:variant.size||""});save();counts()}
function removeCart(key){cart=cart.filter(x=>x.key!==key);save();counts()}
function changeQty(key,delta){const i=cart.findIndex(x=>x.key===key);if(i<0)return;const p=PRODUCTS.find(x=>x.id===cart[i].id);cart[i].qty=Math.max(1,Math.min(p.stock,cart[i].qty+delta));save();counts()}
function subtotal(){return cart.reduce((s,i)=>s+(PRODUCTS.find(p=>p.id===i.id)?.price||0)*i.qty,0)}
function deliveryFee(){return subtotal()>=300||subtotal()===0?0:49}
function initCurrency(){document.querySelectorAll("#currencySelect").forEach(s=>{s.value=currency;s.addEventListener("change",e=>{currency=e.target.value;save();location.reload()})})}
document.addEventListener("DOMContentLoaded",()=>{initCurrency();counts()});