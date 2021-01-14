// Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Classe représentant la scène de fin de jeu
 */
 export class SceneFinJeu extends Phaser.Scene {
     constructor(){
        super("SceneFinJeu");
        this.txtScore;
        this.txtMeilleurScore;
        this.txtRejouer;
     }

     /**
      * Créer les bases de la scène de fin
      */
     create() {
         // Gérer changement d'orientation si sur mobile
        if (!this.sys.game.device.os.desktop) {
            this.verifierOrientation();
            this.scale.on('resize', this.verifierOrientation, this);
        }
        
        this.afficherInterface();
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
        let imgFinJeu = this.add.image((game.config.width/2), (game.config.height), "finJeu");
        GrilleMontage.mettreEchelleRatioX(imgFinJeu);
        imgFinJeu.setOrigin(0.5, 0.5);

        //Animation du texte d'intro
		this.tweens.add({
			targets: imgFinJeu,
            y:game.config.width/2.5, 
            ease: 'Bounce.easeIn',
            callbackScope:this,
            onComplete: this.afficherScores
        });
    }

    /**
     * Afficher les textes et inciter le jouer à rejouer
     */
    afficherScores() {
		game.daneo.meilleurScore = Math.max(game.daneo.score, game.daneo.meilleurScore);
		localStorage.setItem(game.daneo.NOM_LOCAL_STORAGE, game.daneo.meilleurScore);
        // Formatter les textes
        let tailleTexte = Math.round(40 * GrilleMontage.ajusterRatioX());
        let largeurTexte = Math.round(450 * GrilleMontage.ajusterRatioX());
        let style = {
            font: `bold ${tailleTexte}px Arial`,
            color: "#364A42",
            align: "center",
            wordWrap: {width: `${largeurTexte}`, useAdvancedWrap: true}
        }

        // Ajouter la description du jeu
        this.txtScore = this.add.text(game.config.width/2, game.config.height/2, "Score : "+ game.daneo.score, style);
        this.txtScore.setOrigin(0.5, 1.5);
        this.txtScore.setFontFamily("'Cabin Sketch'");
        this.txtScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        this.txtMeilleurScore = this.add.text(game.config.width/2, game.config.height/2, "Meilleur Score : " + game.daneo.meilleurScore, style);
        this.txtMeilleurScore.setOrigin(0.5, -0.5);
        this.txtMeilleurScore.setFontFamily("'Cabin Sketch'");
        this.txtMeilleurScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        this.txtRejouer = this.add.text(game.config.width/2, (game.config.height/3)*2, "Rejouer?", style);
        this.txtRejouer.setOrigin(0.5);
        this.txtRejouer.setFontSize(Math.round(30 * GrilleMontage.ajusterRatioX()));
        this.txtRejouer.setFontFamily("'Cabin Sketch'");
        this.txtRejouer.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

        this.afficherBouton();
    }
    
    /**
     * Afficher le bouton et faire jouer son animation
     */
    afficherBouton() {
		let posX = game.config.width / 2,
			posY = game.config.height * 0.80;
    
        
        let leBouton = this.add.image(posX,posY,"boutons");
        leBouton.setOrigin(0.5, 0.5);

        GrilleMontage.mettreEchelleRatioX(leBouton);

		//Animation du bouton
		this.tweens.add({
            targets: leBouton,
            angle: -360,
			duration: 1000,
			ease: 'Circ.easeOut',
			callbackScope: this,
		});

        //Hover sur le bouton change sa couleur
        leBouton.on("pointerover", function () {
           this.setFrame(1);
        });
        leBouton.on("pointerout", function () {
			this.setFrame(0);
        });
        
		leBouton.setInteractive();
        leBouton.once("pointerdown", this.recommencerJeu, this);
    }

    /**
     * Retour à la scène Jeu
     */
    recommencerJeu() {
        this.scene.start("SceneJeu"); 
    }
}
 