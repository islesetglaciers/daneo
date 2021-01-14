// Importation des scripts et classes nécessaires
import {SceneChargement} from './scenes/SceneChargement.js';
import {SceneIntro} from './scenes/SceneIntro.js';
import {SceneJeu} from './scenes/SceneJeu.js';
import {SceneFinJeu} from './scenes/SceneFinJeu.js';

// Créer le jeu quand la page est chargée
window.addEventListener("load", function(){
    // Dimensions
    let largeur = 576,
        hauteur = 1024;

    // Mobile et tablette
    if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
		  largeur = Math.min(window.innerWidth, window.innerHeight);
		  hauteur = Math.max(window.innerWidth, window.innerHeight);
    }
    
    // Config jeu
    let config = {
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: largeur,
        height: hauteur,
      },
      backgroundColor: 0xFFFAF4,
      scene: [SceneChargement, SceneIntro, SceneJeu, SceneFinJeu],
      input: {
        activePointers: 1,
      }
    }

    //Objet de configuration pour le chargement des fontes
    let webFontConfig = {
      google: {
          families: ["Nanum+Pen+Script", "Cabin+Sketch"]
      },
      active: function () {
          console.log("Les polices de caractères sont chargées");

          // Création du jeu comme tel
          window.game = new Phaser.Game(config);

          window.game.daneo = {
            TAILLE_IMAGE: 150, // Taille des icones représentant chaque mot
            HAUT_TXT: 100, // Hauteur de l'image du texte
            LONG_TXT: 200, // Largeur de l'image du texte
            NB_MOTS: 10, // Nombre de mots à deviner par partie
            NB_CHOIX: 3,  // Nombre de choix de réponse
            TEMPS_MOT: 20, // Temps accordé pour deviner chaque mot
            score: 0, 
            meilleurScore: 0, 
            localStorage: "storageDaneo"
          }
      }
    };

    //Chargement des polices de caractères - À  mettre uniquement après le fichier de configuration pur le chargement des fontes
    WebFont.load(webFontConfig);

}, false);