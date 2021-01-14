// Importer la grille de montage
import {GrilleMontage} from '../utils/GrilleMontage.js';

/**
 * Classe représentant la scène de jeu principale
 * @extends Phaser.Scene
 */
export class SceneJeu extends Phaser.Scene {
    constructor(config){
        super("SceneJeu");

        this.tempsRestant; // Temps restant pour chaque mot
        this.tempsTxt; // Élément texte pour la minuterie
        this.minuterie; // Minuterie
        this.scoreTxt; // Élément texte pour le score
        this.tabChoixImages = []; // Toutes les images possibles
        this.tabpositionChoix = [];
        this.tabMotsATrouver = [];
        this.motATrouver; // Numéro du mot à trouver
        this.motImg; // Élément d'image du mot à identifier
        this.confirmRep; // Élément texte pour la confirmation des réponses
        this.tabImagesAPlacer = [];
        this.grille = null;
        this.boutonPleinEcran;
        this.boutonSon; 
        this.musique;
    }

    init(){
        game.daneo.score = 0;
        this.tabChoixImages = [];
        this.motATrouver = null;
        this.tabMotsATrouver = [];
        this.tabImagesAPlacer = [];
        this.minuterie = null;
        this.tabpositionChoix = [
            [game.config.width * 0.25, 0.65],
            [game.config.width * 0.5, 0.5],
            [game.config.width * 0.75, 0.35]
        ];
        this.motImg = this.add.image(0, 0, "mots");
    }

    /**
     * Créer les objets et définir les principales fonctionnalités du jeu
     */
    create(){
        this.grille = new GrilleMontage(this, 12, 8);
        // this.grille.afficherGrille();
        // Afficher l'interface
        this.afficherInterface();
        // Liste des mots à trouver
        for (let i=0; i < game.daneo.NB_MOTS; i++) {
            this.tabMotsATrouver[i] = i;
        }
        // Placer les choix d'images et le mot à trouver
        this.changerMot();

        this.input.on('gameobjectdown', this.cliquerImg, this);

        // Gérer plein écran
        if (!this.sys.game.device.os.iOS) {
			if (this.sys.game.device.fullscreen.available) {         
				this.boutonPleinEcran = this.add.image(0, 0, "pleinEcran", 0);
				this.grille.placerIndexCellule(86, this.boutonPleinEcran);
				GrilleMontage.mettreEchelleRatioMin(this.boutonPleinEcran);
                this.boutonPleinEcran.setOrigin(0.5, 1.25);
				this.boutonPleinEcran.setInteractive({
                    useHandCursor: true
                });

				this.boutonPleinEcran.on("pointerup", this.changerEcran, this);
			}
        }

        // Musique d'ambiance
        if(!this.musique || !this.musique.isPlaying){
            this.musique = this.sound.add("ambiance", {
                volume: 0.5,
                loop: true
            });
            this.musique.play();
        }

        // Gérer musique
        this.boutonSon = this.add.image(0, 0, "mute", 0);
        this.grille.placerIndexCellule(93, this.boutonSon);
        GrilleMontage.mettreEchelleRatioMin(this.boutonSon);
        this.boutonSon.setOrigin(0.5, 1.25);
        this.boutonSon.setInteractive({
            useHandCursor: true
        });
        this.boutonSon.on("pointerup", this.gererSon, this);
        (game.sonJoue)?this.boutonSon.setFrame(0):this.boutonSon.setFrame(1);

        // Gérer changement d'orientation si sur mobile
        if (!this.sys.game.device.os.desktop) {
            this.verifierOrientation();
            this.scale.on('resize', this.verifierOrientation, this);
        }
    }

    update() {
        if (!this.sys.game.device.os.iOS && this.sys.game.device.fullscreen.available) {
            (!this.scale.isFullscreen) ? this.boutonPleinEcran.setFrame(0): this.boutonPleinEcran.setFrame(1);
        }
    }

    /**
     * Afficher les éléments décoratifs et les textes de l'interface
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

        let imgNomJeu = this.add.image((game.config.width/2), (game.config.height/4), "nomJeu");
        GrilleMontage.mettreEchelleRatioX(imgNomJeu);
        imgNomJeu.setOrigin(0.5, 1);

        // Ajouter les textes
        let tailleTexte = Math.round(36 * GrilleMontage.ajusterRatioX());
        let style = {
            font: `bold ${tailleTexte}px Arial`,
            color: "#364A42",
            align: "left"
        }
        this.scoreTxt = this.add.text(game.config.width/4, ((game.config.height/4)*3), "Score: " + game.daneo.score, style);
        this.scoreTxt.setOrigin(0.5);
        this.scoreTxt.setFontFamily('"Nanum Pen Script"');

        this.tempsTxt = this.add.text(game.config.width/2, ((game.config.height/4)*3), "Temps restant: " + this.tempsRestant, style);
        this.tempsTxt.setOrigin(0.1, 0.5);
        this.tempsTxt.setFontFamily('"Nanum Pen Script"');

        this.confirmRep = this.add.text(game.config.width/2, ((game.config.height/8)*7), "", style);
        this.confirmRep.setOrigin(0.5, 1.5);
        this.confirmRep.setFontFamily('"Nanum Pen Script"');
    }
    
    /**
     * Déterminer quel est le mot à identifier, changer les images et le mot, repartir la minuterie
     */
    changerMot() {
        //Arrêter la minuterie au cas où elle serait déjà en marche et remettre le temps à  la valeur de départ
        this.tempsRestant = game.daneo.TEMPS_MOT;
        this.tempsTxt.text = "Temps restant: " + this.tempsRestant;
        if (this.minuterie !== null) {
            this.minuterie.destroy();
        }
        // Choisir le mot
        if (this.tabMotsATrouver.length > 0) {
            this.motATrouver = Phaser.Utils.Array.RemoveRandomElement(this.tabMotsATrouver);
            console.log("Tableau des mots à trouver: " + this.tabMotsATrouver);
            console.log("Numéro du mot à trouver: " + this.motATrouver);
        } else {
            this.scene.start("SceneFinJeu");
        }
        
        // Placer l'image du mot à trouver
        this.motImg.setOrigin(0.5, 0);
        this.motImg.x = game.config.width / 2;
        this.motImg.y = game.config.height / 3;
        this.motImg.setFrame(this.motATrouver);
        GrilleMontage.mettreEchelleRatioX(this.motImg);
        
        // Créer tableau des images à placer
        for (let i = 0; i < 20; i++) {
            this.tabChoixImages[i] = i;
        }

        //On enlève et détruit les images existantes
        while (this.tabImagesAPlacer.length > 0) {
            let image = this.tabImagesAPlacer.shift();
            image.destroy();
        }

        let indexImgAPlacer = [];
        indexImgAPlacer.push(this.motATrouver);

        // Enlever le mot à trouver du tableau des choix d'images
        this.tabChoixImages.splice(this.tabChoixImages.indexOf(this.motATrouver), 1);

        // Ajouter deux autres images au tableau des images à placer
        for (let i = 0; i < (game.daneo.NB_CHOIX - 1); i++) {
            indexImgAPlacer.push(Phaser.Utils.Array.RemoveRandomElement(this.tabChoixImages));
        }

        indexImgAPlacer = Phaser.Utils.Array.Shuffle(indexImgAPlacer);

        // Placer les trois images dans le jeu
        // Réinitialiser les images des choix de réponse
        let uneImage;
        for (let i = 0; i < indexImgAPlacer.length; i++) {
            uneImage = this.add.image(0, 0, "icones");
            uneImage.x = this.tabpositionChoix[i][0];
            uneImage.y = (game.config.height * 0.5);
            uneImage.setOrigin(this.tabpositionChoix[i][1], 0)
            uneImage.setInteractive();
            uneImage.numero = indexImgAPlacer[i];
            uneImage.setFrame(uneImage.numero);
            uneImage.setDisplaySize(game.config.width / 4.5, game.config.width / 4.5);
            this.tabImagesAPlacer.push(uneImage);
        }
        
        // Minuterie
        this.tempsRestant = game.daneo.TEMPS_MOT;
        this.minuterie = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.diminuerTemps,
            callbackScope: this
        });
    }
    
    /**
     * Vérifier si l'image cliquée est la bonne, afficher texte bonne ou mauvais réponse et jouer son lié
     * 
     * @param  pointer 
     * @param  imgCible Image cliquée
     */
    cliquerImg(pointer, imgCible) {
        // console.log(this.tabMotsATrouver.length);
        if (imgCible.numero === undefined) {
            return;
        }
        this.confirmRep.text = "";
        if (imgCible.numero === this.motATrouver) {
            this.bonneOuMauvaiseRep(42, '#00ff00', "BONNE RÉPONSE!", "bonRep");
            game.daneo.score += 10;
            this.scoreTxt.text = "Score: " + game.daneo.score;
        } else {
            this.bonneOuMauvaiseRep(40, '#ff0000', "MAUVAISE RÉPONSE...", "mauvaisRep");
            if (game.daneo.score != 0) {
                game.daneo.score -= 10;
            }
            this.scoreTxt.text = "Score: " + game.daneo.score;
        }
        this.changerMot();
    }

    /**
     * Affichage du texte indiquant une bonne ou mauvaise réponse ainsi que lecture du son associé
     * 
     * @param {Number} taillePolice Taille de la police de caractères
     * @param {String} couleur Couleur du texte
     * @param {String} contenuTxt Texte à afficher
     * @param {String} nomSon Nom du son à jouer
     */
    bonneOuMauvaiseRep(taillePolice, couleur, contenuTxt, nomSon) {
        this.confirmRep.setFontFamily('"Cabin Sketch"');
        this.confirmRep.setFontSize(Math.round(taillePolice * GrilleMontage.ajusterRatioX()) + "px");
        this.confirmRep.setColor(couleur);
        this.confirmRep.text = contenuTxt;
        this.sound.add(nomSon).play();
    }

    /**
     * Diminuer le temps de la minuterie
     */
    diminuerTemps() {
        this.tempsRestant--;
        this.tempsTxt.text = "Temps restant: " + this.tempsRestant;
        if(this.tempsRestant === 0) {
            this.minuterie.destroy();
            this.input.off('gameobjectdown', this.cliquerImg, this);
            this.scene.start("SceneFinJeu");
        }
    }

    /**
     * Gestion du plein écran
     */
    changerEcran() {
        if (!this.scale.isFullscreen) {
			this.scale.startFullscreen();
		} else {
			this.scale.stopFullscreen();
		}
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
     * Gestion du bouton mute
     */
    gererSon() {
        if (game.sonJoue) {
            this.musique.pause();
            this.boutonSon.setFrame(1);
            //Mémoriser qu'on a arrêté le son au cas où il y aurait un changement d'orientation
            game.sonJoue = false;
        } else {
            this.musique.resume();
            this.boutonSon.setFrame(0);
            //Mémoriser qu'on a reparti le son au cas où il y aurait un changement d'orientation
            game.sonJoue = true;
        }
    }
}