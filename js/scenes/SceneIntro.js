// Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Classe représentant la scène d'introduction du jeu
 * @extends Phaser.Scene
 */
 export class SceneIntro extends Phaser.Scene {
    constructor(config) {
        super("SceneIntro");
        this.txtDescriptionJeu; // Texte descriptif
    }

    create(){
        // Gérer changement d'orientation si sur mobile
        if (!this.sys.game.device.os.desktop) {
            this.verifierOrientation();
            this.scale.on('resize', this.verifierOrientation, this);
        }

        this.afficherInterface();
    }

    /**
     * Afficher les éléments de l'interface et faire jouer la première animation
     */
    afficherInterface() {
        // Dessiner les rectangles décoratifs
        let lesRect = this.add.graphics();
        lesRect.lineStyle(6, 0xB3F5D9, 1);
        lesRect.beginPath();
        lesRect.strokeRect(15, 15, game.config.width - 2 * 15, game.config.height - 2 * 15);
        lesRect.strokePath();
        lesRect.lineStyle(6, 0xFF8778, 1);
        lesRect.beginPath();
        lesRect.strokeRoundedRect(35, 35, game.config.width - 2 * 35, game.config.height - 2 * 35, 40 * GrilleMontage.ajusterRatioX());
        lesRect.strokePath();

        // Ajouter image titre
        let imgNomJeu = this.add.image((game.config.width/2), (game.config.height), "nomJeu");
        GrilleMontage.mettreEchelleRatioX(imgNomJeu);
        imgNomJeu.setOrigin(0.5, 0.5);

        //Animation du texte d'intro
		this.tweens.add({
			targets: imgNomJeu,
            angle: 360,
            y:game.config.width/2.5, 
            ease: 'Sine.easeIn',
            callbackScope:this,
            onComplete: this.afficherInstructions
		});
    
    }

    /**
     * Gestion de l'orientation de l'écran
     */
    verifierOrientation() {
		if (window.orientation != 0) {
            this.scene.pause(this);
            document.getElementById("changerOrientation").style.display = "block";
        } else {
            this.scene.resume(this);
            document.getElementById("changerOrientation").style.display = "none";
        }
    }

    /**
     * Afficher les instructions
     */
    afficherInstructions() {
        // Formatter les textes
        let tailleTexte = Math.round(28 * GrilleMontage.ajusterRatioX());
        let largeurTexte = Math.round(450 * GrilleMontage.ajusterRatioX());
        let style = {
            font: `bold ${tailleTexte}px Arial`,
            color: "#364A42",
            align: "center",
            wordWrap: {width: `${largeurTexte}`, useAdvancedWrap: true}
        }

        // Ajouter la description du jeu
        this.txtDescriptionJeu = this.add.text((game.config.width/2), (game.config.height/2), "Le principe du jeu est simple: Associez le mot coréen à l'image qui lui correspond, mais attention! Vous n'avez que 20 secondes...", style);
        this.txtDescriptionJeu.setOrigin(0.5);
        this.txtDescriptionJeu.setFontFamily("'Cabin Sketch'");
        this.txtDescriptionJeu.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        this.afficherBouton();
    }

    /**
     * Afficher le bouton pour commencer à jouer
     */
    afficherBouton() {
        let leBouton = this.add.image(game.config.width/2, game.config.height*0.80, "boutons", 0);
        leBouton.setOrigin(0.5);
        GrilleMontage.mettreEchelleRatioX(leBouton);

		//Animation du bouton
		this.tweens.add({
            targets: leBouton,
            angle: -360,
			duration: 1000,
			ease: 'Circ.easeOut',
			callbackScope: this,
		});

        //Hover sur le bouton changer de couleur
        leBouton.on("pointerover", function () {
           this.setFrame(1);
        });
        leBouton.on("pointerout", function () {
			this.setFrame(0);
        });
        
		leBouton.setInteractive();
        leBouton.once("pointerdown", this.commencerJeu, this);
        
	}

    /**
     * Aller à la scène du jeu et commencer à jouer
     */
    commencerJeu() {
        this.scene.start("SceneJeu"); 
    }
 }