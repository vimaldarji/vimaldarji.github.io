function toggleSection(sectionId) {
  var sections = document.getElementsByTagName("section");
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.display = "none";
  }

  var navigationLinks = document.querySelectorAll("#menu a");
  for (var i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].classList.remove("active");
  }

  document.getElementById(sectionId).style.display = "block";
  document.getElementById("nav-" + sectionId).classList.add("active");

  document.getElementById(sectionId).scrollIntoView({
    behavior: "smooth",
  });
}

function animateSkillMeters() {
  var skillMeters = document.querySelectorAll(".skill-meter");
  skillMeters.forEach(function (meter) {
    var percent = meter.getAttribute("data-percent");
    meter.style.width = percent + "%";
  });
}

document.addEventListener("scroll", function () {
  var skillsSection = document.getElementById("summary");
  var skillsSectionTop = skillsSection.getBoundingClientRect().top;

  if (skillsSectionTop < window.innerHeight * 0.75) {
    animateSkillMeters();
  }
});

document.getElementById("nav-summary").classList.add("active");
toggleSection("summary");

// Add this part to show "About Me" section on page load
document.addEventListener("DOMContentLoaded", function () {
  toggleSection("summary");
});
