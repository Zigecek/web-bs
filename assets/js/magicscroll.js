var controller = new ScrollMagic.Controller();

function deactiveAll() {
  ['#nav-aboutme', '#nav-contact', '#nav-ttt', '#nav-zigger', '#nav-donate'].forEach((id) => {
    $(id).removeClass('active');
  });
}

new ScrollMagic.Scene({triggerElement: "#about-me-content"})
  .addTo(controller)
  .on("progress", () => {
    deactiveAll();
    $('#nav-aboutme').addClass('active');
  });
new ScrollMagic.Scene({triggerElement: "#contact-content"})
  .addTo(controller)
  .on("progress", () => {
    deactiveAll();
    $('#nav-contact').addClass('active');
  });
new ScrollMagic.Scene({triggerElement: "#tic-tac-toe-content"})
  .addTo(controller)
  .on("progress", () => {
    deactiveAll();
    $('#nav-ttt').addClass('active');
  });
new ScrollMagic.Scene({triggerElement: "#zigger-content"})
  .addTo(controller)
  .on("progress", () => {
    deactiveAll();
    $('#nav-zigger').addClass('active');
  });
new ScrollMagic.Scene({triggerElement: "#donate-content"})
  .addTo(controller)
  .on("progress", () => {
    deactiveAll();
    $('#nav-donate').addClass('active');
  });