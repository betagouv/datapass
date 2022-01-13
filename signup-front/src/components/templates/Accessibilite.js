import React from 'react';
import Button from '../molecules/hyperTexts/Button';

const Accessibilite = () => (
  <main>
    <div className="page-container">
      <h1>Déclaration d’accessibilité</h1>
      <h2>Périmètre d’accessibilité visé</h2>
      <p>
        Dans la suite, nous parlons d’interface utilisable lorsqu’un utilisateur
        a la possibilité de soumettre une demande d’habilitation via DataPass
        bien que l’affichage de certaines fonctionnalités non essentielles à la
        soumission d’une demande puissent être dégradées ou inaccessibles.
      </p>
      <p>
        Nous parlons d’interface optimisée lorsque toutes les fonctionnalités du
        site sont utilisables à leur plein potentiel.
      </p>
      <h2>Couleurs et images</h2>
      <p>
        Le site propose des contrastes de couleurs suffisamment importants pour
        une lecture aisée.
      </p>
      <p>
        L’équipe technique utilise des tests automatiques de contraste et
        accessibilité des images en environnement de développement.
      </p>
      <h2>Compatibilité avec les navigateurs</h2>
      <p>DataPass est optimisé pour les navigateurs suivant :</p>
      <ul>
        <li>
          sous windows 7 et versions ultérieures : Firefox 68 (et versions
          ultérieures), Chrome (dernière version)
        </li>
        <li>sous Linux et Mac OS X : Firefox et Chrome (dernières versions)</li>
      </ul>
      <p>DataPass est utilisable sur les navigateurs suivant :</p>
      <ul>
        <li>sous windows 7 et ultérieures : Internet Explorer 11 et Edge</li>
      </ul>
      <p>
        L’équipe technique teste l’application sur Chrome, Firefox, Firefox 68
        (Windows 7) et IE11 (Windows 7) à chaque changement d’interface.
      </p>
      <h2>Compatibilité avec les différents types d’écran</h2>
      <p>
        L’interface est optimisée pour un écran de bureautique à partir d’une
        résolution de 1024x768 pixels et pour des résolutions supérieures.
      </p>
      <p>
        L’interface est utilisable pour des écrans mobile et tablette de tout
        type.
      </p>
      <p>
        L’équipe technique teste l’application sur mobile, tablette et
        ordinateur à chaque changement d’interface.
      </p>
      <h2>Accessibilité des contenus et respect des standards web</h2>
      <p>
        Les normes d’accessibilité numérique incluent les conditions suivantes :
      </p>
      <ul>
        <li>DataPass est entièrement accessible au clavier</li>
        <li>
          DataPass fournit des indices de repérage et une juste structuration de
          son contenu
        </li>
        <li>DataPass utilise des contrastes de couleurs</li>
        <li>
          les contenus textuels de DataPass peuvent être personnalisés :
          agrandissement des caractères, augmentation de l’interlignage,
          changement de la couleur du texte
        </li>
        <li>les liens présents sur DataPass ont des intitulés explicites</li>
        <li>
          DataPass n’ajoute pas de défilement horizontal au grossissement des
          caractères
        </li>
        <li>DataPass ne véhicule pas d’information par la couleur</li>
      </ul>
      <p>
        L’équipe organise tous les ans un test utilisateur avec une personne non
        voyante pour valider que DataPass est utilisable pour les personnes
        ayant des troubles visuels.
      </p>
      <h2>Problèmes d’accessibilité</h2>
      <p>
        Malgré tous les contrôles d’accessibilité que nous nous efforçons de
        mettre en place, il se peut que vous ou vos collaborateurs rencontriez
        des problèmes d’accessibilité. Vous pouvez nous signaler ces problèmes
        via notre adresse email de contact.
      </p>

      <Button
        large
        href="mailto:datapass@api.gouv.fr?subject=Probl%C3%A8me%20d%27accessibilit%C3%A9"
      >
        Signaler un problème d’accessibilité par email
      </Button>
    </div>
  </main>
);

export default Accessibilite;
