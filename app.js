const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)};
$("#menuBtn").onclick=()=>$("#mainNav").classList.toggle("open");
$$("nav a").forEach(a=>a.onclick=()=>$("#mainNav").classList.remove("open"));

const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

const knowledge=[
 ["Calories","Comprendre l’énergie consommée et dépensée."],
 ["Métabolisme de base","Ce que ton organisme dépense au repos."],
 ["Surcharge progressive","Pourquoi et comment progresser dans le temps."],
 ["Répétitions & intensité","Comprendre les fourchettes plutôt que suivre des chiffres aveuglément."],
 ["Protéines, glucides, lipides, fibres & micronutriments","Protéines, glucides, lipides, fibres, vitamines et minéraux expliqués simplement."],
 ["Récupération & sommeil","Sommeil, hydratation, jours de repos et gestion de la fatigue."],
 ["Suivre son évolution","Poids, performances et tendances sur plusieurs semaines."],
 ["Erreurs à éviter","Les raccourcis qui compliquent inutilement la progression."]
];
$("#knowledgeCards").innerHTML=knowledge.map((x,i)=>`<button class="knowledge-card reveal" data-knowledge="${i}"><span class="eyebrow">FICHE ${String(i+1).padStart(2,"0")}</span><h3>${x[0]}</h3><p>${x[1]}</p></button>`).join("");
$$(".knowledge-card").forEach(el=>io.observe(el));
$$("[data-knowledge]").forEach(b=>b.onclick=()=>openModal(`<p class="eyebrow">BIBLIOTHÈQUE DE CONNAISSANCES</p><h2>${knowledge[b.dataset.knowledge][0]}</h2><p>Cette fiche est administrable : texte, images, vidéos, exemples, graphiques, tableaux et blocs peuvent être ajoutés ou réorganisés.</p><p>Exemple de concept lié : <span class="click-term" onclick="openConcept()">surcharge progressive</span>. Les mots et exercices peuvent renvoyer vers une autre fiche sans dupliquer le contenu.</p>`));

let wizard={goal:null,place:null,freq:null},step=0;
const renderWizard=()=>{
 const body=$("#wizardBody"),dots=$$(".steps i");
 dots.forEach((d,i)=>d.classList.toggle("active",i<=step));
 if(step===0) body.innerHTML=`<h3>1. Quel est ton objectif ?</h3><div class="choice-grid">${["Perte de poids","Prise de muscle","Remise en forme"].map(x=>`<button class="choice" data-v="${x}"><b>${x}</b><p>Choisir cet objectif</p></button>`).join("")}</div>`;
 if(step===1) body.innerHTML=`<h3>2. Où t’entraînes-tu ?</h3><div class="choice-grid">${["Maison","Salle"].map(x=>`<button class="choice" data-v="${x}"><b>${x}</b><p>Programme adapté au matériel disponible</p></button>`).join("")}</div>`;
 if(step===2) body.innerHTML=`<h3>3. Quelle fréquence ?</h3><div class="choice-grid">${["3 séances / semaine","4 séances / semaine"].map(x=>`<button class="choice" data-v="${x}"><b>${x}</b><p>Une fréquence pensée pour être maintenable</p></button>`).join("")}</div>`;
 if(step===3) body.innerHTML=`<p class="eyebrow">PROGRAMME TROUVÉ</p><h3>${wizard.goal}</h3><div class="wizard-summary"><span>Lieu : <b>${wizard.place}</b></span><span>Fréquence : <b>${wizard.freq}</b></span><span>Durée : <b>environ 4 mois</b></span></div><p>APPRENDRE + S’ENTRAÎNER : programmation, fiches d’exercices, contenus pédagogiques, carnet de progression et possibilité de poser des questions.</p><button class="btn btn-primary" onclick="toast('Démo : accès au programme')">VOIR MON PROGRAMME</button> <button class="btn btn-ghost" onclick="resetWizard()">RECOMMENCER</button>`;
 $$("[data-v]",body).forEach(b=>b.onclick=()=>{if(step===0)wizard.goal=b.dataset.v;if(step===1)wizard.place=b.dataset.v;if(step===2)wizard.freq=b.dataset.v;step++;renderWizard()});
};
window.resetWizard=()=>{step=0;wizard={goal:null,place:null,freq:null};renderWizard()};
$$("[data-goal]").forEach(b=>b.onclick=()=>{wizard.goal=b.dataset.goal;step=1;renderWizard();location.hash="commencer"});
renderWizard();

const activityText={
 "1.2":"Très peu d’activité physique en dehors des activités quotidiennes.",
 "1.375":"Activité légère ou quelques entraînements dans la semaine.",
 "1.55":"Activité régulière et plusieurs entraînements par semaine.",
 "1.725":"Volume d’activité élevé, entraînements fréquents ou quotidien actif.",
 "1.9":"Volume d’activité très élevé. À sélectionner seulement si ton quotidien le justifie."
};
const calc=()=>{
 const f=$("#bmrForm"),d=new FormData(f),sex=d.get("sex"),age=+d.get("age"),h=+d.get("height"),w=+d.get("weight"),a=+d.get("activity");
 const bmr=10*w+6.25*h-5*age+(sex==="male"?5:-161); // Mifflin-St Jeor
 const levels=[["Métabolisme basal",1],["Sédentaire",1.2],["Légèrement actif",1.375],["Actif",1.55],["Très actif",1.725],["Extrêmement actif",1.9]];
 $("#bmrValue").textContent=`${Math.round(bmr)} kcal`;
 $("#tdeeValue").textContent=`${Math.round(bmr*a)} kcal`;
 $("#energyBars").innerHTML=levels.map(([n,c])=>`<div class="bar-row"><span>${n}</span><div class="bar"><i style="width:${Math.min(100,c/1.9*100)}%"></i></div><b>${Math.round(bmr*c)}</b></div>`).join("");
 $("#activityHint").textContent=activityText[String(a)];

 // Protéines : on évite d'appliquer mécaniquement 1,6 g au poids total
 // lorsque le poids est très élevé. On utilise alors un poids de référence ajusté.
 const hm=h/100, bmi=w/(hm*hm);
 const refWeight=25*hm*hm;
 const proteinWeight=bmi>30 ? refWeight+0.25*(w-refWeight) : w;
 const proteinLow=Math.round(proteinWeight*1.6);
 const proteinHigh=Math.round(proteinWeight*2.0);
 $("#proteinRange").textContent=`${proteinLow}–${proteinHigh} g / jour`;
 $("#proteinNote").textContent=bmi>30
   ? "Ton poids total n’est pas utilisé mécaniquement pour multiplier les protéines. La fourchette est volontairement ajustée pour rester plus réaliste. Atteindre le bas de la fourchette est déjà très bien : essaie simplement de t’en rapprocher progressivement, sans pression."
   : "Le bas de cette fourchette est déjà un très bon objectif. Il n’est pas nécessaire d’être parfait : essaie de t’en rapprocher progressivement et régulièrement.";
};
$("#bmrForm").addEventListener("submit",e=>{e.preventDefault();calc()});$("#activity").onchange=calc;calc();

const openModal=(html)=>{$("#modalBody").innerHTML=html;$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false")};
const closeModal=()=>{$("#modal").classList.remove("open");$("#modal").setAttribute("aria-hidden","true")};
$("#modalClose").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
window.openConcept=()=>openModal(`<p class="eyebrow">CONCEPT CLIQUABLE</p><h2>Surcharge progressive</h2><p>Le principe consiste à faire progresser graduellement la demande imposée au corps : charge, répétitions, qualité d’exécution ou autre variable pertinente selon le contexte.</p><p>Cette fiche unique peut être liée depuis un article, un exercice ou un programme puis modifiée une seule fois depuis l’administration.</p>`);
$("[data-modal='exercise']").onclick=()=>openModal(`<p class="eyebrow">MODE COMPLET</p><h2>Développé couché</h2><h3>Comment faire ?</h3><p>Zone administrable pour tes consignes personnelles.</p><h3>Pourquoi cet exercice ?</h3><p>Zone administrable pour expliquer ton choix.</p><h3>Points importants & erreurs</h3><p>Ajoute seulement les sections utiles. Aucune section n’est obligatoire.</p><h3>Comment progresser ?</h3><p>Tu peux notamment renvoyer vers <span class="click-term" onclick="openConcept()">surcharge progressive</span>.</p>`);
$("#saveLog").onclick=()=>{$("#logStatus").textContent="Performance enregistrée localement dans cette démo.";toast("Performance enregistrée")};
$("#questionBtn").onclick=()=>openModal(`<p class="eyebrow">QUESTION CLIENT</p><h2>Explique ce qui ne va pas.</h2><p>Contexte joint : Prise de muscle · Salle · Semaine 5 · Séance 1 · Développé couché.</p><textarea rows="6" placeholder="Écris ta question ou ta difficulté…"></textarea><br><br><button class="btn btn-primary" onclick="toast('Question prête à être envoyée')">ENVOYER</button>`);

const tabs=["Vue d’ensemble","Contenu","Programmes","Exercices","Clients","Progression","Questions","Médias","Traductions","Réglages"];
$("#adminTabs").innerHTML=tabs.map((x,i)=>`<button class="admin-tab ${i===0?"active":""}" data-tab="${i}">${x}</button>`).join("");
const adminData={
0:["Tableau de bord",["12 contenus publiés","3 programmes","24 exercices","8 clients actifs"]],
1:["Contenu",["Comprendre les calories","Surcharge progressive","Récupération et sommeil","Continuer par toi-même"]],
2:["Programmes",["Perte de poids · Maison · 3 séances","Prise de muscle · Salle · 3 séances","Remise en forme · Maison · 4 séances"]],
3:["Bibliothèque d’exercices",["Développé couché","Rowing","Squat","Hip thrust"]],
4:["Clients",["Client démo · Accès autorisé","Client test · Accès illimité","Nouveau client · À valider"]],
5:["Progression",["Client démo · Semaine 5/16","Client test · Semaine 8/16"]],
6:["Questions / difficultés",["Développé couché · nouvelle question","Séance 2 · difficulté signalée"]],
7:["Médias",["Vidéos d’exercices","Photos de mouvements","Plats & nutrition","Illustrations de rubriques"]],
8:["Traductions",["Français · principal","English · à compléter","Español · futur"]],
9:["Réglages",["Sessions & appareils","Accès et autorisations","Langues","Compte administrateur"]]
};
function renderAdmin(i=0){
 const [title,items]=adminData[i];
 $("#adminMain").innerHTML=`<div class="admin-toolbar"><div><p class="eyebrow">ADMIN</p><h3>${title}</h3></div><button class="btn btn-primary" onclick="toast('Création ouverte — démo')">+ AJOUTER</button></div><div class="admin-list">${items.map((x,j)=>`<div class="admin-item"><b>${x}</b><span class="status ${j===2&&i===1?"draft":""}">${j===2&&i===1?"BROUILLON":"ACTIF"}</span><button class="mini-btn" onclick="toast('Éditeur ouvert — démo')">MODIFIER</button></div>`).join("")}</div>${i===1?`<div class="glass" style="margin-top:20px"><b>Éditeur par blocs</b><p style="color:#aaa">+ Titre · Sous-titre · Texte · Image · Vidéo · Liste · Exemple · Conseil · Pourquoi ? · Point important · Erreur · Graphique · Tableau · Séparateur</p></div>`:""}`;
}
$$(".admin-tab").forEach(b=>b.onclick=()=>{$$(".admin-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderAdmin(+b.dataset.tab)});
renderAdmin();
$$("[data-admin-jump]").forEach(b=>b.onclick=()=>{location.hash="admin";const idx=7;$$(".admin-tab").forEach((x,i)=>x.classList.toggle("active",i===idx));renderAdmin(idx)});


// Raccourcis cliquables de l'accueil de référence.
document.querySelectorAll('[data-goal-link]').forEach(link=>link.addEventListener('click',()=>{
  try{ localStorage.setItem('heroTrainingPreferredGoal', link.dataset.goalLink || ''); }catch(e){}
}));
// ===== MENU MOBILE HERO TRAINING =====

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("menu-open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("menu-open");
    });
  });
}