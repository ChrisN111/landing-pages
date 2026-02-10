$(document).ready(function () {
  $('.option').on('click', function () {
    $(this).toggleClass('checked tr-selected');
  });
});

var delay_time = 2500;
var everythingLoaded = setInterval(function () {
  /loaded|complete/.test(document.readyState) && (clearInterval(everythingLoaded), setTimeout(function () {
    var a, b = elById("gifImg");
    a = void 0 != b.dataset.gif ? b.dataset.gif : "";
    var c = new Image;
    c.onload = function () {
      b.style.backgroundImage = "url(" + a + ")"
    };
    c.src = a;
    slBGfill()
  }, 300), addQlistner(), "undefined" != typeof elById("vt235y") && null !== elById("vt235y") && document.getElementsByTagName("body")[0].removeChild(elById("vt235y")))
}, 10);

function slBGfill() {
  for (var a = elById("slBg"), b = a.dataset.slides.split(","), c, d = 0; d < b.length; d++) c = document.createElement("div"), c.setAttribute("style", "background-image:url(" + b[d] + ");"), a.appendChild(c);
  slEL = a.children;
  setTimeout(function () {
    slCh()
  }, 1E3)
}
var curr = 0,
  slEL;

function slCh() {
  curr === slEL.length - 1 && (curr = -1, slEL[curr + 1].style.zIndex = "1");
  slEL[curr + 1].style.display = "block";
  var a = 0,
    b = 0;
  setTimeout(function () {
    var c = setInterval(function () {
      b += .1;
      slEL[curr + 1].style.opacity = b;
      a++;
      10 === a && (clearInterval(c), -1 === curr ? (slEL[slEL.length - 1].style.opacity = "0", slEL[slEL.length - 1].style.display = "none", slEL[curr + 1].style.zIndex = "0") : (slEL[curr].style.opacity = "0", slEL[curr].style.display = "none"), curr++, setTimeout(function () {
        slCh()
      }, 2E3))
    }, 100)
  }, 150)
}

function addQlistner() {
  var a = 0,
    b = elById("qB").childElementCount - 1;
  [].slice.call(document.querySelectorAll("#qB >div div")).forEach(function (c, d) {
    c.addEventListener("click", function () {
      var d = c.parentElement;
      if (a < b) {
        0 == a && addListListner();
        var e = d.nextElementSibling;
        d.style.display = "none";
        e.className = "show"
      } else hideOut("qB", 0), bringIn("verify", 0), showVerify(), bringIn("final", delay_time * elById("res").childElementCount);
      a += 1
    })
  })
}

function showVerify() {
  var a = elById("theBar"),
    b = 0,
    c = elById("res").querySelectorAll('p'),
    d = elById("res").childElementCount - 1,
    g = 100 / d,
    e = setInterval(function () {
      if (b < d) {
        c[b].style.display = "none";
        c[b + 1].style.display = "block";
        var f = parseInt(a.style.width) + g;
        98 < f && (f = 98);
        a.style.width = f + "%"
      } else return clearInterval(e), hideOut("verify", 0), null;
      b++
    }, delay_time)
}

function addListListner() {
  [].slice.call(document.querySelectorAll("#qB ul li span")).forEach(function (a, b) {
    a.addEventListener("click", function () {
      a.classList.contains("box-fill") ? a.className = "" : a.className += "box-fill"
    })
  })
}

function bringIn(a, b) {
  setTimeout(function () {
    elById(a).style.display = "block"
  }, b)
}

function hideOut(a, b) {
  setTimeout(function () {
    elById(a).style.display = "none"
  }, b)
}

function elById(a) {
  return document.getElementById(a)
}

function elByCl(a, b) {
  return document.getElementsByClassName(a)[b]
}