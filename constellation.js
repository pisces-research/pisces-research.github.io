var vw = window.innerWidth;
var vh = window.innerHeight;

var textures = document.querySelectorAll(".star");
var main = document.querySelector("#starfield");
var frag = document.createDocumentFragment();
var fish = document.querySelectorAll("#logo-species path");
var pisces = document.querySelector("#logo-words");
var byline = document.querySelector("#byline-text");
var bylineIntro = document.querySelector("#byline-text-intro");


var delayMin = 4;
var delayMax = 8;

var durationMin = 3;
var durationMax = 6;

var numStars = 22;

// Pisces constellation from Wellington June 1968 from https://github.com/benyamindsmith/starBliss
var xPos = [0.284995365984417,0.290094724682495,0.248834109398637,0.301206308363477,0.184400681241859,0.100732325222981,0,0.0500892260863822,0.122626165607155,0.189208580569492,0.286747303366716,0.350024896160263,0.432539921899768,0.711521796917857,0.815120618611279,0.881292379472618,0.919251628754245,0.92965947178336,0.871894407363484,0.793633020387182,0.775039452307487,1];
var yPos = [0.864224174413844,1,0.937267583729137,0.770854758905095,0.642578730219732,0.488869858228134,0.324242675437976,0.331815307286609,0.386748403013222,0.395036160694951,0.416125100997337,0.410498808856224,0.380287423259679,0.256820767769642,0.1691659345882,0.154721193989427,0.10173101125581,0.0305681533749795,0.00416262516990429,0.065486567135866,0.126631629181695,0];
var magnitude = [0.349937749111155,0.410655752752346,0.326279794623039,0.35345468195878,1,0.527292424043049,0.818730753077982,0.371576691022046,0.436049286321536,0.295230166924014,0.203925611734213,0.522045776761016,0.440431654505999,0.663650250136319,0.600495578812266,0.522045776761016,0.239308922243755,0.923116346386636,0.264477261299824,0.418951549247639,0.264477261299824,0.423162082317749];
var bv = [0.312859835075429,0.299093214498829,0.863293977416319,0.320139000800948,0.336552878364737,0.347496738372415,0.870228028458252,0.352395906869619,0.231772266343355,0.226049788697945,0.647264667078035,0.344039088053988,0.19889067044082,0.58625525236722,0.53686962389146,0.30820195895505,0.267402570880001,0.356650132052572,0.859847698659206,0.729788874269057,0.0725847815244687,1];

var stars = [];

// Wait for images to load
window.addEventListener("load", onLoad);

function onLoad() {

  for (var i = 0; i < numStars; i++) {
    stars.push(createStar(i));
  }
  
  main.appendChild(frag);

  tl.fromTo(fish, { opacity: 0, x: -700 }, { opacity: 0.5, duration: 0.7, stagger: 0.7, x: 0 }, "+=1");
  tl.fromTo(pisces, { opacity: 0 }, { opacity: 0.5, duration: 4}, "+=1");
  tl.to(bylineIntro, { autoAlpha: 1, duration: 4}, "+=0.2");
  tl.to(fish, { autoAlpha: 1, duration: 5}, "+=1");
  tl.to(pisces, { autoAlpha: 1, duration: 5}, "<");
  tl.to(byline, { autoAlpha: 1, duration: 5}, "<");
  tl.to(bylineIntro, { autoAlpha: 0, duration: 3}, "<").then(animateFish);
}

function animateFish() {
  fish.forEach((link) => {
    let tween = gsap.timeline()
      .to(
        link, {
        // duration: 0.2,
        // scale: 1.2,
        // rotation: 10,
        duration: 0.3,
        scale: 1.1,
        rotation: 5,
        transformOrigin: "center center",
        ease: "bounce",
        yoyo: true,
        repeat: 3
      })
      .to(link.id.padStart(4,'#').concat('-txt'),{ autoAlpha: 1, duration: 0.1})
      .reversed(true);
    link.anim = tween;
    link.addEventListener("mouseenter", () => link.anim.play());
    link.addEventListener("mouseleave", () => link.anim.reverse());
  }); 
}


function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}

function createStar(i) {
 
  // only using one star style
  var star = textures[0].cloneNode(true);
  frag.appendChild(star);
  
  gsap.set(star, {
    rotation: random(360),
    xPercent: -50,
    yPercent: -50,
    scale: magnitude[i],
    opacity: bv[i],
    x: vw * ((xPos[i] * 0.8) + 0.05),
    y: vh * ((-1 * (yPos[i] - 1) * 0.8) + 0.05),
  });
  
  tl = gsap.timeline();

  var ease1 = new RoughEase({ 
    template:  Linear.easeNone, 
    strength: random(1, 3), 
    points: random(50, 200)|0, 
    taper: "both", 
    randomize: true, 
    clamp: true
  });

  var alpha = bv[i];
    
  var delay = "+=" + random(delayMin, delayMax);  
  var duration1 = random(durationMin, durationMax); 
    
  tl.to(star, duration1, { autoAlpha: alpha, ease: ease1 }, delay)
    
  tl.progress(random(1));
  
  return {
    //element: star,
    timeline: tl
  };
}
