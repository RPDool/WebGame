// Functie om te controleren op een algemene botsing tussen twee objecten
function collision({ object1, object2 }) {
  // Controleer of de onderkant van het eerste object de bovenkant van het tweede object raakt
  // en andersom, en of de linker- en rechterkant van het ene object de tegenoverliggende kanten van het andere object raken
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

// Functie om te controleren op een specifieke botsing tussen de speler en een platform
function platformCollision({ object1, object2 }) {
  // Controleer of de onderkant van het eerste object de bovenkant van het tweede object raakt
  // en of de linker- en rechterkant van het ene object de tegenoverliggende kanten van het andere object raken
  // met een extra controle om ervoor te zorgen dat het onderste deel van het eerste object niet voorbij het onderste deel van het tweede object gaat
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <=
      object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}
