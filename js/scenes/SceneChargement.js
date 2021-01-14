import {GrilleMontage} from "../utils/GrilleMontage.js";

/**
 * Classe repésentant la scène du jeu qui charge les médias
 * @extends Phaser.Scene
 */
export class SceneChargement extends Phaser.Scene {
    constructor(config) {
        super("SceneChargement");
        // Barre chargement
        // this.barreCharge;
        // this.txtProgres;
    }

    preload() {
        /** Barre chargement - commentée car on ne la voit pas ou juste le 100%
        this.barreCharge = this.add.rectangle(0, game.config.height, game.config.width, game.config.height * 0.01, 0xFF8778);
        this.barreCharge.setOrigin(0, 1);

        let tailleTxt = Math.round(30 * GrilleMontage.ajusterRatioX());
        this.txtProgres = this.add.text(game.config.width/2, game.config.height/2, "0%", {
            fontFamily: "Cabin Sketch",
            fontSize: `${tailleTxt}px`,
            fontStyle: "bold",
            color: "#364A42",
            align: "center"
        });
        console.log(this.txtProgres);
        this.txtProgres.setOrigin(0.5);
        */

        // Charger les images
        this.load.setPath("media/img/");
        this.load.spritesheet("mots", "spriteMots.png", {
            frameWidth: this.game.daneo.LONG_TXT,
            frameHeight: this.game.daneo.HAUT_TXT
        });
        // Icones provenant de https://honeybee.suiomi.com/ et modifiés sur PhotoShop
        this.load.spritesheet("icones", "spriteIcones.png", {
            frameWidth: game.daneo.TAILLE_IMAGE,
            frameHeight: game.daneo.TAILLE_IMAGE
        });
        this.load.image("nomJeu", "daneo.png");
        // Éléments UI
        // Icones provenant de https://honeybee.suiomi.com/ et modifiés sur PhotoShop
        this.load.spritesheet("mute", "spriteSon.png", {
            frameWidth: 50,
            frameHeight: 50
        });
        this.load.spritesheet("pleinEcran", "spriteScreen.png", {
            frameWidth: 50,
            frameHeight: 50
        });
        this.load.spritesheet("boutons","spriteBoutons.png", {
            frameWidth: 180,
            frameHeight: 180
        });

        this.load.image("finJeu", "finJeu.png");

        // Charger les sons
        // Proviennent de Zapsplat et looperman.com
        this.load.setPath("media/sons/");
        this.load.audio("bonRep", ["bonneReponse.mp3", "bonneReponse.ogg"]);
        this.load.audio("mauvaisRep", ["mauvaiseReponse.mp3", "mauvaiseReponse.ogg"]);
        this.load.audio("ambiance", ["ambiance.mp3", "ambiance.ogg"]);

        // Gestion progrès
        // this.load.on('progress', this.afficherProgres, this);
    }

    /**
     * Affichage de la progression du chargement des médias
     * 
     * @param {Number} pourcentage 
    
    afficherProgres(pourcentage) {
        console.log("Je progresse!");
        this.txtProgres.text = Math.floor(pourcentage * 100) + " %";
        this.barreCharge.scaleX = pourcentage;
        console.log("Je progresse trop vite pour être visible :(");
    }
     */

    create() {
        this.scene.start("SceneIntro");
    }
}