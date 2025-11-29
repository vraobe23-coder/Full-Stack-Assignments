const navLinks = document.querySelectorAll('.nav a');
function setActiveNav(){
  const path = location.pathname.split('/').pop();
  navLinks.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')===path || (a.getAttribute('href')==='index.html' && path===''));
  });
}
setActiveNav();
window.addEventListener('popstate', setActiveNav);

const packages = [
  {id:1,destination:'Goa',durationDays:4,basePrice:12000,season:'peak'},
  {id:2,destination:'Manali',durationDays:5,basePrice:15000,season:'off'},
  {id:3,destination:'Dubai',durationDays:6,basePrice:52000,season:'peak'},
  {id:4,destination:'Thailand',durationDays:5,basePrice:48000,season:'shoulder'}
];

function seasonMultiplier(season){
  switch(season){
    case 'peak': return 1.25;
    case 'shoulder': return 1.1;
    case 'off': return 0.9;
    default: return 1;
  }
}
function weekendSurcharge(checkIn, nights){
  if(!checkIn || isNaN(checkIn.getTime())) return 0;
  let surcharge = 0;
  for(let i=0;i<nights;i++){
    const d = new Date(checkIn);
    d.setDate(d.getDate()+i);
    const wd = d.getDay();
    if(wd===6 || wd===0) surcharge += 0.05;
  }
  return surcharge;
}
function computeFinalPrice(pkg, checkIn=null, nights=null){
  let price = pkg.basePrice;
  price = price * seasonMultiplier(pkg.season);
  if(nights!==null){
    const perNight = price / pkg.durationDays;
    price = perNight * nights;
  }
  const wkS = weekendSurcharge(checkIn, nights||pkg.durationDays);
  price = price * (1 + wkS);
  return Math.round(price);
}

function renderPackagesTable(){
  const tbody = document.querySelector('#packages-table-body');
  if(!tbody) return;
  tbody.innerHTML = '';
  packages.forEach(p=>{
    const tr=document.createElement('tr');
    const final = computeFinalPrice(p,null,null);
    tr.innerHTML = `<td>${p.id}</td>
<td>${p.destination}</td>
<td>${p.durationDays} days</td>
<td>₹${p.basePrice.toLocaleString()}</td>
<td>${p.season}</td>
<td>₹${final.toLocaleString()}</td>
<td><button class="select-package" data-id="${p.id}">Select</button></td>`;
    tbody.appendChild(tr);
  });
}
document.addEventListener('DOMContentLoaded', ()=> {
  renderPackagesTable();
  attachPackageButtons();
  initBookingEstimator();
  renderGallery();
  setupGalleryLayoutToggle();
  setupModal();
});

function attachPackageButtons(){
  document.body.addEventListener('click', e=>{
    if(e.target.matches('.select-package')){
      const id = Number(e.target.dataset.id);
      const sel = packages.find(x=>x.id===id);
      const selInput = document.querySelector('#est-package');
      if(selInput){
        selInput.value = id;
        selInput.dispatchEvent(new Event('change'));
        selInput.setAttribute('data-selected-dest', sel.destination);
      }
    }
  });
}

function nightsBetween(checkInStr, checkOutStr){
  const ci = new Date(checkInStr);
  const co = new Date(checkOutStr);
  if(isNaN(ci.getTime())||isNaN(co.getTime())) return 0;
  const delta = Math.ceil((co - ci) / (1000*60*60*24));
  return Math.max(0, delta);
}

function initBookingEstimator(){
  const pkgSelect = document.querySelector('#est-package');
  const inDate = document.querySelector('#est-checkin');
  const outDate = document.querySelector('#est-checkout');
  const guests = document.querySelector('#est-guests');
  const promo = document.querySelector('#est-promo');
  const submit = document.querySelector('#est-submit');
  const totalBox = document.querySelector('#est-total');

  function calcAndDisplay(){
    const pid = Number(pkgSelect.value);
    const pkg = packages.find(p=>p.id===pid);
    const ciStr = inDate.value;
    const coStr = outDate.value;
    const nights = nightsBetween(ciStr, coStr);
    const ci = ciStr?new Date(ciStr):null;
    if(!pkg || nights<=0){
      totalBox.textContent = 'Enter valid package & dates';
      submit.disabled = true;
      return;
    }
    let base = computeFinalPrice(pkg, ci, nights);
    let multiplier = 1;
    const g = Number(guests.value) || 1;
    if(g>2) multiplier += 0.2;
    const promoVal = promo.value.trim().toUpperCase();
    let promoDisc = 0;
    switch(promoVal){
      case 'EARLYBIRD': promoDisc = 0.1; break;
      case 'STUDENT50': promoDisc = 0.5; break;
      default: promoDisc = 0;
    }
    let total = base * multiplier * (1 - promoDisc);
    total = Math.round(total);
    totalBox.textContent = `₹${total.toLocaleString()} (${nights} nights, ${g} guest${g>1?'s':''})`;
    submit.disabled = false;
  }

  [pkgSelect,inDate,outDate,guests,promo].forEach(el=>el&&el.addEventListener('input',calcAndDisplay));
  const form = document.querySelector('#est-form');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      if(submit.disabled) return;
      alert('Booking submitted. Estimated total: '+totalBox.textContent);
    });
  }
}

function renderGallery(){
  const grid = document.querySelector('#gallery-grid');
  if(!grid) return;
  const items = [
    {thumb:'images/goa.jpg',large:'images/goa-large.jpg',title:'Goa Beach'},
    {thumb:'images/manali.jpg',large:'images/manali-large.jpg',title:'Manali Mountains'},
    {thumb:'images/dubai.jpg',large:'images/dubai-large.jpg',title:'Dubai Skyline'},
    {thumb:'images/thailand.jpg',large:'images/thailand-large.jpg',title:'Thailand Islands'}
  ];
  grid.innerHTML = '';
  items.forEach((it,idx)=>{
    const div = document.createElement('div');
    div.className = 'thumb';
    div.setAttribute('data-large', it.large);
    div.setAttribute('data-title', it.title);
    div.innerHTML = `<img src="${it.thumb}" alt="${it.title}">
<span class="cap">${it.title}</span>`;
    grid.appendChild(div);
  });
}

function setupGalleryLayoutToggle(){
  const btn = document.querySelector('#layout-toggle');
  const grid = document.querySelector('#gallery-grid');
  if(!btn||!grid) return;
  btn.addEventListener('click', ()=>{
    const current = grid.getAttribute('data-layout')||'grid';
    const next = current==='grid'?'list':'grid';
    grid.setAttribute('data-layout', next);
    if(next==='list') grid.style.gridTemplateColumns = '1fr';
    else grid.style.gridTemplateColumns = 'repeat(auto-fit,minmax(220px,1fr))';
    btn.textContent = next==='grid'?'Switch to List':'Switch to Grid';
  });
}

function setupModal(){
  const modal = document.querySelector('.modal');
  const modalImg = modal?.querySelector('img');
  const closeArea = modal;
  document.body.addEventListener('click', e=>{
    const t = e.target.closest('.thumb');
    if(t){
      const large = t.getAttribute('data-large');
      const title = t.getAttribute('data-title') || '';
      modalImg.src = large;
      modalImg.alt = title;
      modal.classList.add('open');
    }
    if(e.target.matches('.modal-close') || e.target===closeArea) modal.classList.remove('open');
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') modal.classList.remove('open'); });
}
