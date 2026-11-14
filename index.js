// Anagrammes : retrouve le mot caché derrière les lettres mélangées, de plus en plus long à chaque niveau.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Anagrammes</span><span class="hint">Tape les lettres ou clique dessus · Retour arrière : enlever · Espace : mélanger · Tab : indice · Échap : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="anCanvas" width="240" height="136" role="img" aria-label="Anagrammes"></canvas><button class="btn gFs" id="anFs">PLEIN ÉCRAN</button></div>
    <div class="gSide">
      <div class="sysCard"><b>MOTS DU NIVEAU</b><div class="anFound" id="anFound"></div></div>
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="anStats"></div></div>
      <div class="row"><button class="btn main" id="anNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Les lettres d'un mot ont été mélangées : remets-les dans l'ordre. Chaque niveau compte 5 mots, qui s'allongent tous les deux niveaux, de 4 à 9 lettres. Chaque mot trouvé montre sa définition. Un autre mot qui utilise toutes les lettres rapporte un bonus. Trouve vite et sans indice pour enchaîner un combo (×2, ×3) ; le bilan du niveau donne jusqu'à 3 étoiles.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:18px;align-items:flex-start}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:1 1 0;min-width:0;max-width:calc(min(72vh,560px) * 240 / 136 + 20px);position:relative}
.gameBox canvas{width:100%;height:auto;aspect-ratio:240/136;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:0 0 270px;min-width:0}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.anFound{display:flex;flex-direction:column;gap:6px}
.anW{display:flex;flex-direction:column}
.anW span{opacity:.8;font-size:.92em}
.gFs{position:absolute;top:14px;right:14px;opacity:.85}
.gameBox:fullscreen{padding:0;background:#05010b;max-width:none}
.gameBox:fullscreen .gFs{display:none}
.gameBox:fullscreen canvas{max-width:none;width:auto;height:100vh}
@media (max-width:620px){.gMain{flex-direction:column}.gameBox{width:100%;flex:none}.gSide{flex:none;width:100%}}`;
// mot|définition ; sans définition : accepté comme « autre mot » mais jamais tiré
const DICO = `ABEILLE|Insecte qui fabrique le miel.
ABIME|Gouffre très profond.
ABONDANCE|Grande quantité.
ABRICOT|Fruit orangé à noyau.
ABSENT|Qui n'est pas là.
ACCENT|Signe sur une lettre, ou manière de prononcer.
ACCIDENT|Événement imprévu et fâcheux.
ACCORD|Entente.
ACHETER|Obtenir en payant.
ACIER|Métal dur fait de fer et de carbone.
ACROBATIE|Exercice d'agilité.
ACTEUR|Personne qui joue un rôle.
ACTRICE|Femme qui joue un rôle.
ADIEUX|Paroles de départ.
ADIEU|Mot pour se quitter longtemps.
ADORATION|Amour très fort.
ADRESSE|Lieu où l'on habite, ou habileté.
ADULTE|Personne qui a fini de grandir.
AFFAIRE|Chose à faire, ou objet.
AFFICHAGE|Fait de montrer.
AFFICHE|Feuille imprimée collée au mur.
AGENCE|Bureau qui rend un service.
AGENDA|Carnet des rendez-vous.
AGILE|Qui bouge avec facilité.
AGNEAU|Petit du mouton.
AGRESSION|Attaque.
AGRICOLE|Qui concerne l'agriculture.
AGRUME|Fruit comme l'orange ou le citron.
AIDE|Coup de main donné à quelqu'un.
AIGLE|Grand rapace au bec crochu.
AIGUILLE|Tige fine pour coudre.
AIGUILLON|Dard d'un insecte.
AIGU|Pointu, ou très haut pour un son.
AILE|Partie du corps qui permet aux oiseaux de voler.
AIMANT|Objet qui attire le fer.
AIMER|Éprouver de l'affection ou de l'amour.
AIRE|Surface, ou nid d'un grand rapace.
ALARME|Signal qui prévient d'un danger.
ALBUM|Livre de photos, ou disque de chansons.
ALGUE|Plante qui pousse dans l'eau.
ALLIANCE|Bague de mariage, ou union.
ALLO|Mot pour répondre au téléphone.
ALLUMER|Mettre en marche, ou mettre le feu.
ALLUMETTE|Petit bâton qui fait du feu.
ALLURE|Vitesse, ou apparence.
ALPHABET|Ensemble des lettres d'une langue.
AMANDE|Fruit sec ovale.
AMATEUR|Personne qui aime une activité sans en faire son métier.
AMBIANCE|Atmosphère d'un lieu.
AMBITIEUX|Qui veut réussir.
AMBRE|Résine fossile jaune et transparente.
AMBULANCE|Véhicule qui transporte les blessés.
AMER|Qui a un goût âpre, comme le café sans sucre.
AMIE|Personne avec qui on partage une amitié.
AMITIE|Lien entre amis.
AMOUR|Sentiment très fort pour quelqu'un.
AMPOULE|Lampe en verre, ou cloque.
AMUSEMENT|Distraction.
ANANAS|Gros fruit tropical à la couronne de feuilles.
ANCETRE|Personne de qui l'on descend.
ANCIENNES|Vieilles.
ANCIEN|Qui existe depuis longtemps.
ANCRE|Pièce lourde qui retient un bateau au fond.
ANECDOTE|Petite histoire amusante.
ANGE|Être céleste aux ailes blanches.
ANGLE|Coin formé par deux lignes.
ANIMAL|Être vivant qui se déplace.
ANIMAUX|Êtres vivants qui se déplacent.
ANNEAU|Cercle de métal.
ANNEE|Durée de douze mois.
ANNONCE|Message pour informer.
ANSE|Poignée en arc d'un panier ou d'une tasse.
ANTENNE|Tige qui capte les ondes.
APPAREIL|Machine, instrument.
APPARENCE|Ce que l'on voit d'abord.
APPEL|Action d'appeler quelqu'un.
APPETIT|Envie de manger.
APPLAUDIR|Taper des mains pour féliciter.
ARAIGNEE|Petit animal à huit pattes qui tisse une toile.
ARBRE|Grand végétal à tronc de bois.
ARCHER|Personne qui tire à l'arc.
ARCHIVE|Document ancien conservé.
ARENE|Lieu où se déroulent combats et spectacles.
ARGENTIN|Qui sonne clair comme l'argent.
ARGENT|Métal précieux, ou monnaie.
ARGILE|Terre que l'on modèle.
ARMATURE|Charpente qui soutient.
ARME|Objet qui sert à attaquer ou à se défendre.
ARMOIRE|Grand meuble de rangement à portes.
ARRIVEE|Moment où l'on arrive.
ARROSOIR|Récipient à bec pour arroser.
ARTICHAUT|Légume aux feuilles en écailles.
ARTISTE|Personne qui crée des œuvres.
ASCENSEUR|Cabine qui monte les étages.
ASPECT|Apparence d'une chose.
ASPERGE|Légume en longue tige.
ASSIETTEE|Contenu d'une assiette.
ASSIETTE|Plat individuel dans lequel on mange.
ASTRE|Corps céleste, comme une étoile.
ASTUCE|Moyen malin de réussir.
ATELIER|Lieu où travaille un artisan.
ATHLETE|Sportif.
ATOME|Plus petite partie d'un élément.
ATRE|Partie de la cheminée où l'on fait le feu.
ATTAQUER|Commencer un combat.
ATTENTE|Temps passé à attendre.
ATTENTION|Concentration.
AUBERGE|Petit hôtel de campagne.
AUBERGINE|Légume violet.
AUBE|Moment où le jour se lève.
AUNE|Arbre des bords de l'eau.
AURORE|Lever du jour.
AUTEUR|Personne qui a écrit un livre.
AUTOBUS|Grand véhicule de transport en commun.
AUTOMATE|Machine qui imite un être vivant.
AUTOMNE|Saison où tombent les feuilles.
AUTRUCHE|
AUTRUI|Les autres personnes.
AVALANCHE|Masse de neige qui dévale la montagne.
AVENIR|Le temps qui viendra.
AVENTURE|Expérience pleine de risques.
AVEU|Action de reconnaître une faute.
AVION|Appareil qui vole avec des ailes et des moteurs.
AVIRON|Rame, ou sport de rame.
AVIS|Ce que l'on pense de quelque chose.
AVOCATS|Fruits verts, ou défenseurs.
AVOCAT|Fruit vert à gros noyau, ou défenseur au tribunal.
AVRIL|Quatrième mois de l'année.
AXES|Lignes autour desquelles une chose tourne.
BADMINTON|Sport de raquette avec un volant.
BAGAGE|Valise ou sac de voyage.
BAGARRE|Dispute avec des coups.
BAGUETTE|Pain long, ou bâton magique.
BAGUE|Anneau porté au doigt.
BAIE|Petit fruit rond, ou large entrée de la mer dans la côte.
BAIGNOIRE|Cuve pour prendre un bain.
BAIN|Eau dans laquelle on se lave en entier.
BALAI|Brosse à long manche pour nettoyer le sol.
BALANCE|Instrument pour peser.
BALCON|Plateforme en saillie sur une façade.
BALEINEAU|Petit de la baleine.
BALEINE|Très grand mammifère marin.
BALLADE|Chanson douce, ou poème.
BALLE|Petite boule pour jouer.
BALLON|Sphère gonflée avec laquelle on joue.
BAMBOU|Grande plante à tige creuse.
BANANE|Fruit jaune et allongé.
BANC|Long siège pour plusieurs personnes.
BANDEAU|Bande de tissu autour de la tête.
BANDE|Long morceau étroit, ou groupe de personnes.
BANQUE|Établissement qui garde l'argent.
BANQUIER|Personne qui dirige une banque.
BARBECUE|Grill pour cuire en plein air.
BARBE|Poils qui poussent sur le menton.
BARBIER|Personne qui rase la barbe.
BARQUE|Petit bateau.
BARRAGE|Mur qui retient l'eau d'une rivière.
BARRE|Longue pièce rigide.
BASE|Partie inférieure qui soutient, point de départ.
BASSE|Peu élevée, ou guitare aux sons graves.
BASSIN|Petit plan d'eau.
BATAILLE|Combat entre deux armées.
BATEAU|Engin qui flotte et navigue.
BATIMENT|Construction.
BATON|Long morceau de bois.
BATTERIE|Instrument à percussions, ou pile.
BAVARDAGE|Discussion sans fin.
BAVARD|Qui parle beaucoup.
BEAU|Agréable à regarder.
BEIGE|Couleur brun très clair.
BEIGNET|Pâte frite.
BELLE|Jolie, agréable à regarder.
BERCEAU|Petit lit de bébé.
BERET|Chapeau rond et plat sans bord.
BERGER|Personne qui garde les moutons.
BETAIL|Animaux de la ferme.
BETE|Animal, ou personne qui manque d'esprit.
BETON|Mélange dur de ciment, sable et gravier.
BEURRE|Matière grasse tirée de la crème.
BIBERONS|Bouteilles pour bébés.
BIBERON|Bouteille pour faire boire un bébé.
BIBLE|Livre sacré des chrétiens.
BIDULE|Objet dont on ignore le nom.
BIEN|Ce qui est bon et juste.
BIJOUTIER|Personne qui vend des bijoux.
BIJOUX|Objets précieux qu'on porte.
BIJOU|Objet précieux qu'on porte pour se parer.
BILLARD|Jeu de boules sur une table à tapis.
BILLET|Ticket, ou papier-monnaie.
BILLE|Petite boule de verre pour jouer.
BISCUIT|Petit gâteau sec.
BISE|Petit baiser sur la joue, ou vent froid du nord.
BLAIREAU|Animal des bois à museau rayé.
BLANC|Couleur de la neige.
BLESSURE|Plaie, lésion.
BLEU|Couleur du ciel par beau temps.
BLOC|Gros morceau compact.
BLOND|Couleur jaune clair des cheveux.
BLOUSE|Vêtement de travail ample.
BOCAL|Récipient en verre à large ouverture.
BOEUF|Mâle de la vache.
BOIS|Matière dure des arbres.
BOITE|Récipient avec un couvercle.
BONBON|Petite friandise sucrée.
BOND|Saut vif vers l'avant ou vers le haut.
BONHEUR|État de joie.
BONNET|Petit chapeau de laine.
BONNE|Qui a des qualités, agréable.
BORDURE|Ce qui borde.
BORD|Limite, extrémité d'une surface.
BOTTE|Chaussure qui monte haut sur la jambe.
BOUCHER|Commerçant qui vend la viande.
BOUCHE|Ouverture du visage pour manger et parler.
BOUCLIER|Plaque qui protège des coups.
BOUE|Terre mouillée et collante.
BOUGIE|Bâton de cire avec une mèche.
BOULANGER|Personne qui fait le pain.
BOULEAU|Arbre à écorce blanche.
BOULE|Objet parfaitement rond.
BOUQUETIN|Chèvre sauvage des montagnes.
BOUQUET|Fleurs coupées réunies.
BOURGEOIS|Habitant aisé d'une ville.
BOUSSOLE|Instrument dont l'aiguille montre le nord.
BOUTEILLE|Récipient au goulot étroit.
BOUTIQUE|Petit magasin.
BOUTON|Petit objet rond pour fermer un vêtement.
BOUT|Extrémité de quelque chose.
BRACELET|Bijou porté au poignet.
BRANCHE|Partie d'un arbre qui part du tronc.
BRAS|Membre du corps entre l'épaule et la main.
BRAVE|Courageux.
BREVE|Courte.
BRILLANT|Qui jette de l'éclat.
BRINDILLE|Petite branche fine.
BRIN|Petite tige fine.
BRIOCHE|Pain sucré et moelleux.
BRIQUE|Bloc de terre cuite pour construire.
BRISE|Vent léger et doux.
BROCHETTE|Morceaux enfilés sur une tige.
BROSSE|Ustensile à poils pour nettoyer.
BROUETTE|Petit chariot à une roue.
BROUILLON|Premier essai d'un texte.
BRUIT|Son plus ou moins fort.
BRUME|Brouillard léger.
BRUN|Couleur sombre, proche du marron.
BUFFET|Grand meuble, ou repas où l'on se sert.
BUISSON|Groupe de petits arbustes.
BULLETIN|Petit papier, ou relevé de notes.
BULLE|Petite boule d'air.
BUREAU|Table de travail, ou lieu de travail.
BUSE|Rapace au vol plané.
CABANE|Petite maison simple.
CABINE|Petite pièce fermée.
CABLE|Gros fil ou corde solide.
CACAHUETE|Graine d'arachide.
CACAO|Graine dont on fait le chocolat.
CACTUS|Plante grasse à piquants.
CADEAU|Objet offert.
CADENAS|Serrure mobile.
CADRE|Bordure qui entoure un tableau.
CAFE|Boisson chaude faite de grains torréfiés.
CAGE|Abri fermé de barreaux pour un animal.
CAHIERS|
CAHIER|Ensemble de feuilles pour écrire.
CAILLOU|Petite pierre.
CAISSE|Grande boîte, ou guichet où l'on paie.
CALCUL|Opération sur des nombres.
CALE|Objet qui empêche de bouger, ou fond d'un navire.
CALME|Tranquille, sans agitation.
CAMARADE|Compagnon, ami.
CAMERA|Appareil qui filme.
CAMION|Gros véhicule de transport.
CAMPAGNES|Territoires hors des villes.
CAMPAGNE|Territoire hors des villes.
CAMPEUR|Personne qui dort sous la tente.
CAMPING|
CAMP|Lieu où l'on installe des tentes.
CANAL|Cours d'eau creusé par l'homme.
CANAPE|Long siège rembourré.
CANARD|Oiseau aquatique au bec plat.
CANE|Femelle du canard.
CANICULE|Période de très forte chaleur.
CANNE|Bâton pour s'appuyer en marchant.
CANOT|Petit bateau.
CANTINE|Lieu où l'on mange à l'école.
CAPE|Grand manteau sans manches.
CAPITAINE|Chef d'un navire ou d'une équipe.
CAPITALE|Ville principale d'un pays.
CAPITAL|Principal, ou argent.
CAPRICE|Envie soudaine.
CAPS|Pointes de terre qui avancent dans la mer.
CAPUCHE|Bonnet attaché au manteau.
CARAMEL|Sucre fondu et doré.
CARAVANE|Petite maison roulante.
CARNAVAL|Fête où l'on se déguise.
CARNET|Petit cahier.
CAROTTE|Légume racine orange.
CARREAU|Vitre, ou motif en carré.
CARROSSE|Belle voiture à chevaux.
CARTABLE|Sac d'écolier.
CARTE|Feuille avec un plan, ou carton de jeu.
CARTON|Papier épais et rigide.
CARTOUCHE|Recharge d'encre ou de munition.
CASCADE|Chute d'eau.
CASERNE|Bâtiment des soldats ou des pompiers.
CASQUETTE|Chapeau à visière.
CASQUE|Coiffure rigide qui protège la tête.
CASSEROLE|Récipient pour cuire.
CASSE|Brisé, cassé.
CASTING|Choix des acteurs.
CASTOR|Rongeur qui construit des barrages.
CAUSE|Ce qui produit un effet.
CAVALERIE|Troupe à cheval.
CAVE|Pièce sous la maison, souvent fraîche.
CEINTURE|Bande qui tient le pantalon.
CELEBRITE|Personne très connue.
CENTRE|Point du milieu.
CERCLE|Figure parfaitement ronde.
CERF|Grand animal des forêts aux bois ramifiés.
CERISE|Petit fruit rouge à noyau.
CERISIERS|Arbres à cerises.
CERVEAU|Organe de la pensée, dans le crâne.
CHAGRIN|Peine, tristesse.
CHAINE|Suite d'anneaux de métal.
CHAIR|Partie molle du corps sous la peau.
CHAISE|Siège à dossier pour une personne.
CHALET|Maison de bois en montagne.
CHAMEAU|Animal à deux bosses.
CHAMPAGNE|Vin pétillant.
CHAMPION|Vainqueur d'une compétition.
CHAMPS|Terrains cultivés.
CHAMP|Terrain cultivé.
CHANCE|Hasard heureux.
CHANDELLE|Bougie.
CHANSON|Paroles mises en musique.
CHANTEUR|Personne qui chante.
CHANT|Suite de sons musicaux faits avec la voix.
CHAPEAU|Coiffure avec un bord.
CHAPELIER|Personne qui fait des chapeaux.
CHARBON|Roche noire qui brûle.
CHARGE|Poids que l'on porte.
CHARIOT|Voiture à roues pour porter des charges.
CHARPENTE|Assemblage de poutres d'un toit.
CHAR|Véhicule de guerre blindé, ou voiture de fête.
CHASSEUR|Personne qui chasse.
CHASSE|Action de poursuivre des animaux.
CHATAIGNE|Fruit brun du châtaignier.
CHATEAU|Grande demeure fortifiée.
CHATON|Petit du chat.
CHAT|Petit félin domestique.
CHAUDRON|Grande marmite.
CHAUD|Qui a une température élevée.
CHAUFFAGE|Ce qui chauffe une maison.
CHAUSSON|Chaussure d'intérieur.
CHAUSSURE|Ce qu'on porte aux pieds.
CHEF|Personne qui dirige.
CHEMINEE|Endroit où l'on fait du feu dans une maison.
CHEMIN|Voie étroite.
CHEMISE|Vêtement à col et boutons.
CHENILLE|Larve du papillon.
CHER|Qui coûte beaucoup, ou que l'on aime.
CHEVALIER|Noble combattant à cheval.
CHEVAL|Grand animal qu'on peut monter.
CHEVEUX|Poils de la tête.
CHEVEU|Poil de la tête.
CHEVREUIL|Petit cerf des bois.
CHEVRE|Animal à cornes qui donne du lait.
CHIEN|Animal domestique fidèle qui aboie.
CHIFFRE|Signe qui écrit un nombre.
CHOCOLAT|Gourmandise faite de cacao.
CHOIX|Action de choisir.
CHOSES|Objets quelconques.
CHOSE|Objet, ou idée quelconque.
CHOU|Légume aux feuilles serrées en boule.
CIDRE|Boisson faite de pommes fermentées.
CIEL|Espace au-dessus de nos têtes.
CIGARETTE|Tabac roulé dans du papier.
CIGOGNE|Grand oiseau blanc migrateur.
CIMETIERE|Lieu où l'on enterre les morts.
CIME|Sommet d'un arbre ou d'une montagne.
CINEMA|Salle où l'on voit des films.
CINQ|Le nombre 5.
CIRE|Matière molle produite par les abeilles.
CIRQUE|Spectacle avec clowns et acrobates.
CISEAUX|Outil à deux lames pour couper.
CITOYENNE|Habitante d'un pays.
CITOYEN|Membre d'un pays.
CITRON|Fruit jaune acide.
CLAIRIERE|Endroit sans arbres dans une forêt.
CLAIR|Lumineux, ou facile à comprendre.
CLAN|Groupe de familles ou de personnes unies.
CLASSE|Groupe d'élèves, ou salle d'école.
CLAVECIN|Ancien instrument à clavier.
CLAVIER|Ensemble de touches.
CLEF|Objet qui ouvre une serrure.
CLIENT|Personne qui achète.
CLIMAT|Temps habituel d'une région.
CLOCHER|Tour qui porte les cloches.
CLOCHE|Instrument qui sonne.
CLOU|Petite tige de métal pointue qu'on enfonce.
CLOWN|Artiste de cirque qui fait rire.
COCHE|Petite marque pour valider.
COCHON|Animal rose de la ferme.
COCO|Fruit du cocotier.
COEUR|Organe qui pompe le sang.
COFFRE|Grande boîte solide.
COIN|Angle formé par deux côtés.
COLERE|Grand mécontentement.
COLLEGUE|Personne qui travaille avec soi.
COLLE|Produit qui fait tenir ensemble.
COLLIER|Bijou porté autour du cou.
COLLINE|Petite montagne arrondie.
COLOMBE|Pigeon blanc, symbole de paix.
COLS|Passages entre deux montagnes.
COMBAT|Lutte.
COMEDIE|Pièce drôle.
COMETE|Astre à longue queue lumineuse.
COMPAGNON|Personne qui accompagne.
COMPTER|Calculer un nombre.
COMPTE|Calcul, ou argent en banque.
CONCERT|Spectacle de musique.
CONCOMBRE|Légume long et vert.
CONCOURS|Compétition.
CONFIANCE|Fait de croire en quelqu'un.
CONFITURE|Fruits cuits avec du sucre.
CONSEIL|Avis donné pour aider.
CONSIGNE|Ordre à suivre.
CONTACT|Toucher, ou relation.
CONTE|Histoire imaginaire pour enfants.
COPAIN|Ami.
COPIE|Reproduction d'un original.
COPINE|Amie.
COQUILLE|Enveloppe dure d'un œuf ou d'un mollusque.
CORBEAU|Grand oiseau noir.
CORDE|Gros fil fait de fibres tressées.
CORDON|Petite corde.
CORNEMUSE|Instrument à sac et tuyaux.
CORNET|Cône de biscuit pour la glace.
CORNE|Partie dure qui pousse sur la tête de certains animaux.
CORNICHON|Petit concombre au vinaigre.
CORPS|Ensemble formé par la tête, le tronc et les membres.
CORRIDA|Combat de taureaux.
CORRIDOR|Couloir.
COSTUME|Vêtement d'homme habillé, ou déguisement.
COTEAU|Petite colline.
COTE|Pente d'une route, ou rivage de la mer.
COTON|Fibre blanche et douce d'une plante.
COUCHER|Mettre au lit, ou disparition du soleil.
COUCHE|Épaisseur, ou lange de bébé.
COUDE|Articulation au milieu du bras.
COULEUR|Impression que donne la lumière : rouge, bleu…
COULOIR|Passage étroit dans un bâtiment.
COUPE|Verre à pied, ou trophée.
COUP|Choc donné ou reçu.
COURAGE|Force face au danger.
COURONNE|Cercle porté sur la tête par un roi.
COURRIER|Lettres reçues ou envoyées.
COURT|De petite longueur.
COUR|Espace découvert entouré de bâtiments.
COUSIN|Enfant de l'oncle ou de la tante.
COUSSIN|Petit sac moelleux.
COUTEAU|Ustensile à lame pour couper.
COUVENT|Maison de religieux.
COUVERCLE|Ce qui ferme une casserole.
CRABE|Animal marin à carapace qui marche de côté.
CRAIE|Bâton blanc pour écrire au tableau.
CRAN|Entaille, ou courage.
CRAPAUD|Batracien à peau verruqueuse.
CRAVATE|Bande de tissu nouée au cou.
CRAYONNER|Dessiner au crayon.
CRAYON|Bâton de bois pour écrire ou dessiner.
CREME|Partie grasse du lait.
CREPES|Fines galettes poêlées.
CREPE|
CREUX|Qui a un vide à l'intérieur.
CREVETTE|Petit crustacé.
CRINIERE|Poils du cou du cheval ou du lion.
CRIN|Poil long du cheval.
CRIQUET|Insecte sauteur proche de la sauterelle.
CRISE|Moment difficile.
CRISTAL|Verre très pur, ou minéral.
CROCHET|Petite pièce recourbée.
CROCODILE|Grand reptile aux mâchoires puissantes.
CROISSANT|Viennoiserie en forme de lune.
CROIX|Figure faite de deux traits qui se coupent.
CROUTE|Partie dure du pain.
CRUE|Montée des eaux d'une rivière.
CRUSTACE|Animal à carapace comme le crabe.
CUBE|Solide à six faces carrées.
CUILLERE|Ustensile pour manger la soupe.
CUIR|Peau d'animal tannée.
CUISINE|Pièce où l'on prépare les repas.
CUISINIER|Personne qui fait la cuisine.
CULBUTER|Faire une culbute.
CULTURE|Connaissances, ou action de cultiver.
CURIEUX|Qui veut savoir.
CUVE|Grand récipient pour les liquides.
CYCLONE|Tempête tournante très violente.
CYGNE|Grand oiseau blanc au long cou.
DAME|Femme, ou pièce du jeu de dames.
DANGER|Ce qui menace.
DANSEUR|Personne qui danse.
DANSEUSE|Femme qui danse.
DANSE|Mouvements du corps en rythme.
DATE|Jour précis, ou fruit du palmier.
DAUPHIN|Mammifère marin intelligent.
DEBOUT|Sur ses pieds.
DEBUTANTE|Celle qui commence.
DEBUT|Commencement.
DECEMBRE|Douzième mois de l'année.
DEFENSEUR|Personne qui protège.
DEHORS|À l'extérieur.
DELICIEUX|Très bon.
DELTA|Embouchure d'un fleuve en plusieurs bras.
DEMAIN|Le jour suivant.
DEMANDER|Poser une question, solliciter.
DEMENAGER|Changer de logement.
DENTELLE|Tissu ajouré et fin.
DENTISTE|Médecin des dents.
DENT|Petit os dur dans la bouche, qui sert à mâcher.
DESERT|Région sèche et sans eau.
DESIR|Envie de quelque chose.
DESSERT|Plat sucré de fin de repas.
DESSINER|Tracer une image.
DESSIN|Image tracée à la main.
DESSUS|Partie supérieure.
DETAIL|Petite partie d'un ensemble.
DEUX|Le nombre 2.
DEVOIR|Ce que l'on doit faire.
DIABLE|Démon.
DIAMANTS|Pierres précieuses.
DIAMANT|Pierre précieuse très dure.
DIGUE|Mur qui retient l'eau.
DIMANCHE|Septième jour de la semaine.
DIMENSION|Taille, mesure.
DINDON|Gros oiseau de basse-cour.
DINOSAURE|Grand reptile disparu.
DIRECTEUR|Personne qui dirige.
DIRE|Exprimer par la parole.
DISCOURS|Paroles dites devant un public.
DISTANCE|Espace entre deux points.
DIVERTIR|Amuser.
DOCTEUR|Médecin.
DOIGT|Chacune des cinq extrémités de la main.
DOMAINE|Terres d'une propriété, ou spécialité.
DOME|Toit arrondi en forme de demi-sphère.
DOMINOS|Jeu de pièces à points.
DOMINO|
DONC|Mot qui marque une conséquence.
DOSE|Quantité précise d'une chose.
DOSSIER|Partie d'un siège où l'on s'adosse, ou classeur.
DOUANE|Service qui contrôle les frontières.
DOUANIER|Agent qui contrôle aux frontières.
DOUCEUR|Qualité de ce qui est doux.
DOUCE|Agréable, sans violence.
DOUCHE|Jet d'eau pour se laver.
DOUX|Agréable au toucher, sans brusquerie.
DOUZAINE|Ensemble de douze.
DOUZE|Le nombre 12.
DRAGONS|
DRAGON|Monstre légendaire qui crache du feu.
DRAME|Événement tragique, ou pièce de théâtre.
DRAPEAU|Pièce d'étoffe aux couleurs d'un pays.
DROIT|Qui ne penche pas, ou ce qui est permis.
DROLE|Qui fait rire.
DUEL|Combat entre deux personnes.
DUNE|Colline de sable formée par le vent.
DUVET|Plumes légères, ou couette.
EAUX|Masses d'eau.
ECHARPE|Bande de tissu autour du cou.
ECHEC|Résultat raté.
ECHELLE|Montants et barreaux pour grimper.
ECHO|Son renvoyé par un obstacle.
ECLAIRAGE|Lumière d'un lieu.
ECLAIR|Lumière vive d'un orage.
ECOLE|Lieu où l'on apprend.
ECOLIER|Enfant qui va à l'école.
ECOLOGIE|Science de la nature.
ECORCE|Peau d'un arbre.
ECRAN|Surface où s'affichent les images.
ECRIVAIN|Personne qui écrit des livres.
ECRU|Couleur blanc cassé, naturelle.
ECUREUIL|Petit rongeur roux à la queue touffue.
EDREDON|Couverture épaisse et chaude.
EFFET|Résultat d'une cause.
EFFORT|Action de forcer.
EFFRAYANT|Qui fait peur.
EGAL|Pareil, de même valeur.
EGLISE|Bâtiment de culte chrétien.
ELAN|Mouvement vif pour avancer ou sauter.
ELASTIQUE|Qui s'étire et revient.
ELEPHANT|Très grand animal à trompe.
ELEVE|Personne qui apprend à l'école.
ELFE|Petit génie des légendes nordiques.
EMBALLAGE|Ce qui enveloppe un objet.
EMBARQUER|Monter à bord.
EMOTION|Sentiment vif.
EMPEREUR|Souverain d'un empire.
ENCHANTER|Charmer.
ENCLOS|Terrain fermé pour les animaux.
ENCORE|De nouveau.
ENERGIE|Force qui permet d'agir.
ENFANCE|Période où l'on est enfant.
ENFANT|Jeune être humain.
ENGRENAGE|Roues dentées qui s'emboîtent.
ENIGME|Chose difficile à comprendre.
ENNEMI|Adversaire.
ENTONNOIR|Cône pour verser dans un goulot.
ENTRAINER|Exercer, ou emmener.
ENTREE|Lieu par où l'on entre.
ENVELOPPE|Pochette de papier pour une lettre.
ENVIE|Désir de quelque chose.
EPAIS|Qui a une grande épaisseur.
EPAULE|Haut du bras.
EPEE|Arme à longue lame.
EPICERIE|Magasin d'alimentation.
EPICES|Poudres qui relèvent le goût.
EPICE|Plante qui donne du goût aux plats.
EPINARD|Légume à feuilles vertes.
EPINE|Pointe dure sur une tige.
EPISODE|Partie d'une histoire.
EPIS|Têtes des tiges de blé.
EPONGE|Objet qui absorbe l'eau.
EQUATEUR|Ligne qui partage la Terre en deux.
EQUILIBRE|Fait de tenir sans tomber.
EQUIPE|Groupe qui travaille ou joue ensemble.
ERREUR|Faute, chose fausse.
ESCALADE|Montée d'une paroi.
ESCALIER|Suite de marches pour monter.
ESCARGOT|Mollusque à coquille en spirale.
ESPACE|Étendue, ou univers.
ESPIEGLE|Vif et malicieux.
ESPOIR|Attente confiante de ce qu'on désire.
ESPRIT|Pensée, intelligence.
ESSAI|Tentative.
ETABLE|Abri des vaches.
ETAGERE|Planche fixée au mur pour poser des objets.
ETAGE|Niveau d'un immeuble.
ETANG|Étendue d'eau calme, plus petite qu'un lac.
ETAT|Manière d'être, ou pays organisé.
ETINCELLE|Petite parcelle de feu.
ETOFFE|Tissu.
ETOILE|Astre qui brille la nuit.
ETONNANT|Surprenant.
ETRANGE|Bizarre.
ETRE|Exister, ou créature vivante.
ETUDIANT|Personne qui fait des études.
EVENTAIL|Objet qu'on agite pour faire de l'air.
EXAMEN|Épreuve pour vérifier des connaissances.
EXCELLENT|Très bon.
EXEMPLE|Modèle, cas précis.
EXPLORER|Parcourir pour découvrir.
EXPLOSION|Éclatement violent.
EXTRA|Supplémentaire, ou excellent.
FABLE|Petite histoire avec une morale.
FABRIQUER|Faire, produire.
FACE|Visage, ou côté d'un objet.
FACILE|Qui ne demande pas d'effort.
FACTEUR|Personne qui distribue le courrier.
FADE|Qui manque de goût.
FAIM|Envie de manger.
FAISCEAU|Rayon de lumière.
FAIT|Chose qui est arrivée.
FAMILIER|Que l'on connaît bien.
FAMILLE|Parents et enfants.
FANFARE|Orchestre de cuivres.
FANTOME|Esprit d'un mort qui apparaît.
FAON|Petit de la biche.
FARANDOLE|Danse en chaîne.
FARCEUR|Personne qui fait des blagues.
FARD|Maquillage.
FARINE|Poudre de blé.
FAUCON|Oiseau de proie rapide.
FAUTEUIL|Siège confortable à bras.
FAUTE|Erreur.
FAUVE|Grand félin sauvage.
FEMME|Être humain adulte de sexe féminin.
FENETRE|Ouverture vitrée dans un mur.
FERME|Exploitation agricole, ou solide.
FERMIERE|Femme qui tient une ferme.
FERMIER|Personne qui cultive une ferme.
FESTIN|Grand repas de fête.
FESTIVAL|Grande série de spectacles.
FETE|Moment de joie partagé, célébration.
FEUILLAGE|Ensemble des feuilles.
FIBRE|Fil très fin.
FICELLE|Petite corde.
FICHE|Petite feuille pour noter.
FICHIER|Ensemble de données dans un ordinateur.
FIERE|Contente d'elle, avec dignité.
FIER|Content de soi, avec dignité.
FIGURE|Visage, ou forme.
FIGURINE|Petite statuette.
FILET|Réseau de mailles, ou morceau de viande tendre.
FILE|Rangée de personnes les unes derrière les autres.
FILLE|Enfant de sexe féminin.
FILM|Histoire racontée en images animées.
FILS|Enfant de sexe masculin.
FINAL|Qui arrive à la fin.
FINI|Terminé.
FLAMANT|Grand oiseau rose.
FLAMBEAU|Torche.
FLAMME|Partie lumineuse d'un feu.
FLAN|Dessert à base d'œufs et de lait.
FLECHE|Projectile de l'arc, ou signe d'orientation.
FLEUR|Partie colorée d'une plante.
FLEUVE|Grand cours d'eau qui se jette dans la mer.
FLOCONS|
FLOCON|Petite parcelle de neige.
FLOTTEUR|Objet qui reste sur l'eau.
FLOT|Masse d'eau en mouvement.
FLUTE|Instrument à vent en forme de tube.
FOIE|Organe qui filtre le sang et fait la bile.
FOIN|Herbe séchée pour nourrir les animaux.
FOIRE|Grand marché, ou fête foraine.
FOIS|Moment où une chose se produit.
FONDUE|Plat de fromage fondu.
FOND|Partie la plus basse ou la plus éloignée.
FONTAINE|Construction d'où coule de l'eau.
FONT|Bassin du baptême, ou verbe faire.
FOOTBALL|Sport où l'on pousse un ballon du pied.
FORAGE|Action de creuser un trou profond.
FORCE|Capacité d'agir avec puissance.
FORET|Grand espace couvert d'arbres.
FORGERON|Artisan qui travaille le fer.
FORMAT|Dimensions.
FORME|Aspect extérieur.
FORTUNE|Grande richesse, ou chance.
FORT|Qui a de la force.
FOUDRE|Décharge électrique d'un orage.
FOUET|Ustensile pour battre les œufs.
FOUGERE|Plante des sous-bois.
FOULE|Grand nombre de personnes.
FOURMI|Petit insecte qui vit en colonie.
FOURNEAU|Appareil où l'on fait du feu pour cuire.
FOUR|Appareil qui cuit les aliments.
FRAISE|Petit fruit rouge.
FRAIS|Un peu froid, ou récent.
FRAMBOISE|Petit fruit rouge et parfumé.
FRANCHISE|Sincérité.
FRELON|Grosse guêpe.
FRERE|Garçon né des mêmes parents.
FRIANDISE|Petite gourmandise sucrée.
FRISSON|Tremblement de froid ou de peur.
FRITE|Bâtonnet de pomme de terre frit.
FROID|Qui a une température basse.
FROMAGE|Aliment fait de lait caillé.
FROMENT|
FRONTIERE|Limite entre deux pays.
FRUIT|Partie de la plante qui contient les graines.
FUMEE|Gaz qui s'échappe de ce qui brûle.
FUSEAU|Instrument pour filer.
FUSEE|Engin qui part dans l'espace.
FUSILLADE|Échange de coups de feu.
FUSIL|
GAGNANTE|Celle qui gagne.
GAGNANT|Personne qui gagne.
GAIN|Ce que l'on gagne.
GALAXIE|Immense ensemble d'étoiles.
GALA|Grande fête officielle.
GALERIE|Long couloir, ou salle d'exposition.
GALETTE|Gâteau rond et plat.
GALET|Caillou lisse et rond.
GALOPER|Courir au galop.
GANT|Vêtement qui couvre la main.
GARAGE|Lieu où l'on range la voiture.
GARCON|Enfant de sexe masculin.
GARDEROBE|Armoire à vêtements.
GARDE|Surveillance, ou personne qui surveille.
GARDIEN|Personne qui surveille.
GARE|Lieu où s'arrêtent les trains.
GATEAU|Pâtisserie sucrée.
GAUCHE|Côté opposé à la droite.
GAUFRETTE|Petit biscuit croustillant.
GAUFRE|Pâtisserie en forme de quadrillage.
GAZELLE|Antilope rapide.
GAZON|Herbe courte et fine.
GEANT|Très grand.
GELE|Couvert de glace.
GENERAL|Chef d'une armée, ou commun à tous.
GENEREUX|Qui donne volontiers.
GENIAL|Formidable.
GENOU|Articulation au milieu de la jambe.
GENRE|Sorte, catégorie.
GERANIUM|Plante à fleurs rouges des balcons.
GIRAFE|Animal au très long cou.
GIROUETTE|Plaque qui tourne avec le vent.
GIVRE|Fine couche de glace blanche.
GLACE|Eau gelée, ou miroir.
GLACIER|Masse de glace en montagne, ou marchand de glaces.
GLACON|Petit cube de glace.
GLAS|Cloche qui sonne pour un mort.
GLISSADE|Fait de glisser.
GLOBE|Sphère, ou la Terre.
GOAL|Gardien de but.
GOMME|Petit bloc pour effacer.
GORGE|Partie avant du cou.
GORILLE|Grand singe.
GOURMAND|Qui aime manger.
GOUTTE|Petite quantité de liquide.
GOUT|Sens qui perçoit les saveurs.
GRAINE|Semence d'une plante.
GRAIN|Petite graine, ou petit morceau.
GRAND|De grande taille.
GRANGE|Bâtiment pour le foin.
GRAS|Qui contient beaucoup de matière grasse.
GRATUIT|Qui ne coûte rien.
GRAVE|Sérieux, ou son bas.
GRAVIER|Petits cailloux.
GRAVILLON|Petit caillou.
GRENADE|Fruit à grains rouges.
GRENIER|Pièce sous le toit.
GREVE|Arrêt de travail collectif.
GRILLE|Clôture à barreaux.
GRIMACE|Contorsion du visage.
GRIS|Couleur entre le blanc et le noir.
GROS|De grande taille, épais.
GROTTE|Cavité naturelle dans la roche.
GRUE|Grand oiseau, ou engin de chantier qui soulève.
GUERRE|Lutte armée entre pays.
GUICHET|Petite ouverture où l'on est servi.
GUIDE|Personne qui montre le chemin.
GUIRLANDE|Décoration en chaîne.
GUITARE|Instrument à six cordes.
HABITANT|Personne qui vit dans un lieu.
HACHE|Outil pour couper le bois.
HAIES|Rangées d'arbustes.
HALL|Grande entrée d'un bâtiment.
HALO|Cercle lumineux autour d'une source.
HAMAC|Toile suspendue pour se reposer.
HAMBURGER|Pain rond garni de viande hachée.
HAMEAU|Petit groupe de maisons.
HAMSTER|Petit rongeur aux grosses joues.
HANCHE|Partie du corps entre la taille et la cuisse.
HANGAR|Grand abri pour ranger.
HARICOT|Légume en gousse.
HARMONIE|Accord agréable.
HARPE|Grand instrument à cordes.
HASARD|Ce qui arrive sans raison.
HAUTEUR|Dimension de bas en haut.
HAUT|Partie supérieure, élevé.
HEBERGER|Loger quelqu'un.
HELICE|Pièce tournante à pales.
HERBE|Plante verte et basse.
HERISSON|Petit animal couvert de piquants.
HERITAGE|Biens reçus d'une personne décédée.
HEROS|Personne courageuse et admirée.
HEURE|Chacune des 24 parties d'un jour.
HIBOU|Oiseau de nuit aux grandes plumes sur la tête.
HIER|Le jour avant aujourd'hui.
HISTOIRE|Récit, ou étude du passé.
HIVER|Saison la plus froide.
HOMARD|Grand crustacé marin.
HOMMAGE|Marque de respect.
HOMME|Être humain adulte de sexe masculin.
HONNEUR|Dignité, estime.
HONTE|Sentiment de gêne après une faute.
HOPITAL|Lieu où l'on soigne les malades.
HORAIRE|Tableau des heures.
HORIZON|Ligne où le ciel semble toucher la terre.
HORLOGER|Personne qui répare les montres.
HORLOGE|Grande pendule.
HOTEL|Lieu où l'on dort en voyage.
HOULE|Mouvement des vagues au large.
HUILE|Liquide gras.
HUITRE|Coquillage de mer.
HUMAIN|Qui concerne l'homme.
HUMIDITE|Présence d'eau dans l'air.
HUMOUR|Art de faire rire.
HURLEMENT|Cri très fort.
IDEE|Pensée, projet qui vient à l'esprit.
IGLOO|Maison de neige des peuples du Grand Nord.
ILOT|Petite île.
IMAGE|Représentation visuelle.
IMAGINER|Se représenter dans l'esprit.
IMMEUBLE|Grand bâtiment à étages.
IMMOBILE|Qui ne bouge pas.
IMPATIENT|Qui ne sait pas attendre.
INCENDIE|Grand feu destructeur.
INDEX|Doigt qui montre, ou liste alphabétique.
INFIRMIER|Personne qui soigne les malades.
INSECTE|Petit animal à six pattes.
INTERDIT|Défendu.
INTERNET|Réseau mondial d'ordinateurs.
INVENTION|Chose nouvelle imaginée.
ISOLER|Mettre à part.
JADE|Pierre précieuse verte.
JAGUAR|Grand félin d'Amérique tacheté.
JAMAIS|À aucun moment.
JAMBE|Membre inférieur du corps.
JAMBON|Viande de porc.
JARDINIER|Personne qui entretient un jardin.
JARDIN|Terrain où l'on cultive fleurs et légumes.
JAUNE|Couleur du citron.
JETE|Lancé, ou pas de danse.
JEUNE|Qui n'est pas vieux.
JEUX|Activités pour s'amuser.
JOIE|Sentiment de grand bonheur.
JOLI|Agréable à voir.
JONGLEUR|Artiste qui lance et rattrape des objets.
JONQUILLE|Fleur jaune du printemps.
JOUET|Objet pour jouer.
JOUEUR|Personne qui joue.
JOUE|Partie du visage sous l'œil.
JOURNAL|Publication qui donne les nouvelles.
JOURNAUX|Publications de nouvelles.
JOURNEE|Temps du matin au soir.
JOUR|Temps entre le lever et le coucher du soleil.
JUDO|Sport de combat japonais.
JUGE|Personne qui rend la justice.
JUMEAU|Né en même temps qu'un frère ou une sœur.
JUMELLES|Instrument pour voir loin.
JUNGLE|Forêt tropicale très dense.
JUPE|Vêtement qui part de la taille et couvre les jambes.
JUSTE|Équitable, ou exact.
JUSTICE|Respect du droit.
KANGOUROU|Animal sauteur à poche d'Australie.
KAYAK|Petit bateau pointu qu'on fait avancer à la pagaie.
KIWI|Fruit vert à peau brune, ou oiseau.
LAINE|Poil épais du mouton.
LAITUE|Salade verte.
LAIT|Liquide blanc produit par les mammifères.
LAME|Partie tranchante d'un couteau.
LAMPE|Appareil qui éclaire.
LANCE|Arme à long manche et pointe.
LANGOUSTE|Gros crustacé sans pinces.
LANGUE|Organe de la bouche, ou parler d'un peuple.
LANTERNE|Boîte vitrée qui protège une lumière.
LAPINS|Petits animaux aux longues oreilles.
LAPIN|Petit animal aux longues oreilles.
LAPS|Durée de temps.
LARGE|Qui a une grande largeur.
LARME|Goutte qui coule de l'œil.
LASER|Faisceau de lumière très concentré.
LAVANDE|Plante violette parfumée.
LAVE|Roche fondue qui sort d'un volcan.
LECTURE|Action de lire.
LEGENDE|Récit merveilleux.
LEGER|Qui pèse peu.
LEGUME|Plante que l'on mange.
LENT|Qui ne va pas vite.
LEOPARD|Grand félin tacheté.
LESSIVE|Produit pour laver le linge.
LETTRE|Signe de l'alphabet, ou message écrit.
LEVER|Mettre plus haut.
LEZARD|Petit reptile à quatre pattes.
LIBELLULE|Insecte aux ailes fines.
LIBERTE|Possibilité d'agir comme on veut.
LIBRAIRIE|Magasin de livres.
LIBRE|Qui peut faire ce qu'il veut.
LICORNE|Cheval de légende à une corne.
LIEN|Ce qui attache ou relie.
LIEU|Endroit, place.
LIGNE|Trait continu.
LIMACE|Mollusque sans coquille.
LIME|Outil pour user le métal ou les ongles.
LIMONADE|Boisson gazeuse sucrée.
LION|Grand félin à crinière.
LIRE|Comprendre un texte écrit.
LISSE|Sans aspérité.
LISTE|Suite de noms ou d'objets écrits.
LITRES|Unités de volume.
LITRE|Unité de volume.
LIVRE|Ensemble de pages reliées.
LOCAL|Pièce, ou propre à un lieu.
LOGE|Petite pièce, ou balcon au théâtre.
LOIN|À une grande distance.
LOISIRS|Temps libre pour s'amuser.
LONG|Qui s'étend sur une grande longueur.
LOUPE|Verre qui grossit.
LOUP|Animal sauvage proche du chien, qui vit en meute.
LOUTRE|Animal qui nage dans les rivières.
LUEUR|Faible lumière.
LUMIERE|Ce qui éclaire.
LUMINEUSE|Qui éclaire.
LUNDIS|Premiers jours de la semaine.
LUNDI|Premier jour de la semaine.
LUNETTES|Verres qui aident à voir.
LUNE|Astre qui tourne autour de la Terre.
LUTH|Instrument de musique à cordes ancien.
LUTIN|Petit génie malicieux.
LUXE|Ce qui est coûteux et raffiné.
MACHINE|Appareil qui fait un travail.
MAGASIN|Lieu où l'on vend des marchandises.
MAGE|Savant mystérieux, magicien.
MAGICIEN|Personne qui fait des tours de magie.
MAGIE|Art de faire des choses surnaturelles.
MAIN|Extrémité du bras, avec cinq doigts.
MAIRE|Personne qui dirige une commune.
MAISON|Bâtiment où l'on habite.
MAIS|Mot qui marque une opposition.
MAJUSCULE|Grande lettre.
MALE|Être de sexe masculin.
MALHEUR|Événement triste.
MALIN|Rusé, astucieux.
MANCHE|Partie du vêtement qui couvre le bras.
MANDARINE|Petit agrume sucré.
MANEGE|Attraction qui tourne.
MANGE|Avale de la nourriture.
MANGUE|Fruit tropical à chair orange.
MANOIR|Petit château à la campagne.
MANTEAU|Vêtement chaud que l'on met dehors.
MARATHON|Course de 42 kilomètres.
MARCHANDE|Femme qui vend.
MARCHAND|Personne qui vend.
MARCHE|Action de marcher, ou degré d'escalier.
MARDI|Deuxième jour de la semaine.
MARE|Petite étendue d'eau stagnante.
MARGE|Espace blanc au bord d'une page.
MARIAGE|Union de deux personnes.
MARIN|Personne qui navigue en mer.
MARMELADE|Confiture d'agrumes.
MARMITE|Grande casserole.
MARMOTTE|Rongeur des montagnes qui hiberne.
MARRON|Couleur brune, ou fruit du châtaignier.
MARTEAU|Outil pour enfoncer les clous.
MASQUE|Objet qui couvre le visage.
MASSE|Grande quantité, ou gros marteau.
MATCH|Rencontre sportive.
MATELAS|Partie molle du lit.
MATELOT|Marin.
MATERNEL|Qui concerne la mère.
MATINALE|Qui se lève tôt.
MATIN|Début de la journée.
MEDAILLE|Pièce de métal donnée en récompense.
MEDECIN|Personne qui soigne.
MELANGE|Ensemble de choses mêlées.
MELODIE|Suite de notes agréable.
MELON|Gros fruit sucré à chair orange.
MEMOIRE|Capacité de se souvenir.
MENSONGE|Ce qui n'est pas vrai, dit pour tromper.
MENTON|Bas du visage.
MENUISIER|Artisan du bois.
MENU|Liste des plats d'un repas.
MERCI|Mot pour remercier.
MERE|Femme qui a des enfants.
MERLE|Oiseau noir au bec jaune.
MERVEILLE|Chose admirable.
MESSAGER|Personne qui porte un message.
MESSAGE|Information transmise.
MESURE|Dimension, quantité.
METAL|Matière dure comme le fer ou l'or.
METEORITE|Pierre tombée de l'espace.
METIER|Travail que l'on fait.
METRE|Unité de longueur.
MIDI|Le milieu de la journée, douze heures.
MIEL|Produit sucré fait par les abeilles.
MIEUX|De meilleure façon.
MINCE|Fin, peu épais.
MINE|Visage, ou lieu où l'on extrait des minerais.
MINUSCULE|Très petit, ou petite lettre.
MINUTE|Soixante secondes.
MIROIR|Surface qui reflète les images.
MISSION|Tâche confiée.
MODE|Manière de s'habiller du moment.
MOISSON|Récolte des céréales.
MOIS|Chacune des douze parties de l'année.
MOMENT|Court espace de temps.
MONASTERE|Lieu où vivent des moines.
MONDE|La Terre et tous ses habitants.
MONSTRE|Être effrayant.
MONTAGNE|Grande élévation de terrain.
MONTRE|Petite horloge au poignet.
MONT|Grande montagne.
MORAL|État d'esprit.
MORCEAUX|Parties d'un tout.
MORCEAU|Partie d'un tout.
MORT|Fin de la vie.
MOTEUR|Machine qui fait avancer.
MOTO|Véhicule à deux roues et à moteur.
MOTS|Ensembles de lettres qui ont un sens.
MOUCHE|Insecte volant.
MOUCHOIR|Petit linge pour le nez.
MOUETTE|Oiseau de mer blanc.
MOULE|Coquillage, ou forme pour gâteaux.
MOULIN|Machine qui écrase le grain.
MOUSSE|Bulles serrées, ou petite plante.
MOUSTACHE|Poils au-dessus de la lèvre.
MOUSTIQUE|Insecte qui pique.
MOUTON|Animal à laine.
MOUVEMENT|Fait de bouger.
MOYEN|Manière de faire, ou entre les deux.
MUET|Qui ne parle pas.
MULE|Animal né d'un âne et d'une jument.
MULTITUDE|Très grand nombre.
MURE|Fruit noir de la ronce.
MUSCADE|Épice en noix.
MUSCLE|Organe qui fait bouger le corps.
MUSEE|Lieu où l'on expose des œuvres.
MUSICIEN|Personne qui fait de la musique.
MUSIQUE|Art des sons.
MYSTERE|Chose cachée, inexpliquée.
NAGER|Se déplacer dans l'eau.
NAGE|Façon de se déplacer dans l'eau.
NAIN|Personnage de très petite taille.
NAPPE|
NATATION|Sport de la nage.
NATURE|Monde vivant, ou caractère.
NAUFRAGE|Perte d'un bateau en mer.
NAVIRE|Grand bateau.
NEIGE|Eau gelée qui tombe en flocons.
NENUPHAR|Plante flottante des étangs.
NERF|Fil qui transmet les sensations dans le corps.
NEUF|Tout nouveau, ou le nombre 9.
NICHE|Petite maison du chien.
NIVEAU|Hauteur, ou degré.
NOBLE|Qui a de la grandeur.
NOCTURNE|De la nuit.
NOEL|Fête du 25 décembre.
NOEUD|Boucle serrée d'un fil.
NOIR|Couleur la plus sombre.
NOISETTE|Petit fruit du noisetier.
NOIX|Fruit à coque dure du noyer.
NOMBRE|Quantité, chiffre.
NOSTALGIE|Regret du passé.
NOTE|Son de musique, ou appréciation chiffrée.
NOUVELLE|Information récente, ou court récit.
NUAGES|Masses de gouttelettes dans le ciel.
NUAGE|Masse de gouttelettes dans le ciel.
NUIT|Temps où il fait sombre.
NUMERO|Chiffre qui désigne.
OASIS|Point d'eau dans le désert.
OBJET|Chose que l'on peut toucher.
OBSERVER|Regarder avec attention.
OBUS|Projectile tiré par un canon.
OCCASION|Moment favorable.
OCEANIQUE|De l'océan.
OCEAN|Très grande étendue de mer.
OCRE|Couleur jaune-brun tirée de la terre.
OCTOBRE|Dixième mois de l'année.
ODEUR|Ce que sent le nez.
OFFRE|Proposition.
OISEAU|Animal à plumes et à bec.
OLIVIER|
OMBRE|Zone sombre créée par un obstacle à la lumière.
OMELETTE|Œufs battus cuits à la poêle.
ONCE|Petit poids ancien, ou panthère des neiges.
ONCLE|Frère du père ou de la mère.
ONDE|Vague, ou vibration qui se propage.
ONGLE|Lame dure au bout du doigt.
ONZE|Le nombre 11.
OPALE|Pierre aux reflets changeants.
OPERA|Spectacle chanté avec orchestre.
OPTIMISTE|Qui voit le bon côté.
ORAGEUX|Chargé d'orage.
ORAGE|Pluie forte avec éclairs et tonnerre.
ORANGE|Fruit rond, ou couleur.
ORCHESTRE|Groupe de musiciens.
ORCHIDEE|Fleur rare et élégante.
ORDRE|Organisation, ou commandement.
OREILLER|Coussin pour la tête.
OREILLE|Organe de l'ouïe.
ORGE|Céréale utilisée pour la bière.
ORGUE|Grand instrument à tuyaux.
ORME|Grand arbre aux feuilles dentelées.
ORPHELIN|Enfant qui a perdu ses parents.
ORTEIL|Doigt du pied.
OSER|Avoir le courage de faire.
OUEST|Point cardinal où le soleil se couche.
OURAGAN|Tempête très violente.
OURSON|Petit de l'ours.
OURS|Grand mammifère au pelage épais.
OUTIL|Objet qui sert à travailler.
OUVRIER|Personne qui travaille de ses mains.
OUVRIR|Rendre accessible.
OVALE|En forme d'œuf.
PAGE|Une face d'une feuille de livre.
PAILLASSE|Matelas de paille.
PAILLE|Tige sèche de céréale.
PAIN|Aliment cuit au four fait de farine.
PAIRE|Deux choses qui vont ensemble.
PAIR|Nombre divisible par deux.
PAIX|Absence de guerre, calme.
PALAIS|Grand bâtiment royal.
PALE|Sans couleur, blême.
PALMIER|Arbre des pays chauds.
PANDA|Ours noir et blanc qui mange du bambou.
PANIER|Récipient tressé avec une anse.
PANNE|Arrêt d'une machine qui ne marche plus.
PANTALON|Vêtement qui couvre chaque jambe.
PANTHERE|
PANTOUFLE|Chausson.
PAON|Oiseau à la queue en éventail colorée.
PAPA|Le père, en langage familier.
PAPETERIE|Magasin de papier et stylos.
PAPE|Chef de l'Église catholique.
PAPIER|Feuille fine pour écrire.
PAPILLON|Insecte aux grandes ailes colorées.
PAPRIKA|
PAQUET|Objet emballé.
PARACHUTE|Toile qui freine une chute.
PARAPLUIE|Objet qui abrite de la pluie.
PARC|Grand jardin public.
PARENT|Père ou mère.
PARESSEUX|Qui n'aime pas l'effort.
PARFUM|Odeur agréable.
PARI|Jeu où l'on mise sur un résultat.
PAROLE|Mot dit à voix haute.
PARTAGE|Division entre plusieurs.
PARTI|Groupe politique, ou s'en est allé.
PASSAGER|Personne transportée.
PASSAGE|Lieu par où l'on passe.
PASSE|Le temps d'avant.
PASTEQUE|
PATATE|Pomme de terre, en langage familier.
PATE|Mélange de farine et d'eau, ou nouilles.
PATIENT|Calme, ou malade.
PATINAGE|Glisse sur des patins.
PATIN|Chaussure à lame ou à roulettes.
PATISSIER|Personne qui fait des gâteaux.
PATRON|Chef d'une entreprise.
PATTE|Jambe d'un animal.
PAUSE|Petit arrêt.
PAYER|Donner de l'argent.
PAYSAGE|Étendue que l'on voit.
PEAU|Enveloppe qui recouvre le corps.
PECHEURS|
PECHEUR|Personne qui pêche.
PECHE|Fruit à peau duveteuse, ou action de pêcher.
PEIGNE|Objet pour coiffer.
PEINE|Tristesse, ou punition.
PEINTRE|Artiste qui peint.
PEINTURE|Couleur qu'on étale, ou tableau.
PELICAN|
PELLE|Outil pour creuser.
PELOUSE|Terrain couvert de gazon.
PELUCHE|Jouet doux en tissu.
PENDULE|Petite horloge.
PENSEE|Idée.
PENTE|Terrain qui monte ou descend.
PERE|Homme qui a des enfants.
PERLE|Petite boule brillante des huîtres.
PERROQUET|Oiseau coloré qui imite la voix.
PERRUQUE|Faux cheveux.
PERSIL|Herbe aromatique.
PETIT|De petite taille.
PEUR|Sentiment face à un danger.
PHARE|Tour lumineuse qui guide les bateaux.
PHARMACIE|Magasin de médicaments.
PHOTO|Image prise avec un appareil.
PIANO|Grand instrument de musique à touches.
PIECE|Partie d'une maison, ou morceau.
PIED|Extrémité de la jambe.
PIERRE|Morceau de roche.
PIGEON|Oiseau gris des villes.
PILE|Tas d'objets, ou batterie électrique.
PILOTE|Personne qui conduit un avion.
PINCEAU|Outil à poils pour peindre.
PINCE|Outil pour serrer.
PINGOUIN|Oiseau marin noir et blanc.
PION|Pièce d'un jeu de société.
PIPE|Objet pour fumer du tabac.
PIRANHA|
PIRATES|
PIRATE|Bandit des mers.
PISCINE|Bassin pour nager.
PISTACHE|Petit fruit sec vert.
PISTE|Chemin tracé, ou trace.
PITIE|Compassion pour la souffrance d'autrui.
PLACARD|Armoire fixée au mur.
PLACE|Espace libre, ou grande cour en ville.
PLAGE|Bord de mer couvert de sable.
PLAIE|Blessure.
PLAINE|Grande étendue plate.
PLAISIR|Sentiment agréable.
PLANCHE|Long morceau de bois plat.
PLANETE|Astre qui tourne autour d'une étoile.
PLANTEUR|Personne qui plante.
PLANTE|Végétal.
PLATEAU|Grand plat, ou terrain plat en hauteur.
PLAT|Assiette de service, ou sans relief.
PLEIN|Rempli entièrement.
PLONGEE|Action de plonger sous l'eau.
PLONGEON|Saut dans l'eau.
PLUIE|Eau qui tombe des nuages.
PLUMEAU|
PLUME|Ce qui couvre le corps des oiseaux.
PLUS|Davantage.
PNEU|Enveloppe de caoutchouc d'une roue.
POCHES|Petits sacs cousus dans un vêtement.
POCHE|Petit sac cousu dans un vêtement.
POEME|Texte écrit en vers.
POESIE|Art des vers et des rimes.
POIDS|Masse d'une chose.
POIGNEE|Partie que l'on tient.
POIGNET|Articulation entre la main et le bras.
POIL|Fin filament qui pousse sur la peau.
POING|Main fermée.
POINT|Petite marque ronde.
POIRE|Fruit en forme de goutte.
POISSONS|
POISSON|Animal qui vit dans l'eau et respire par des branchies.
POIS|Petite graine ronde et verte.
POIVRE|Épice piquante.
POIVRON|
POKER|Jeu de cartes où l'on mise.
POLE|Extrémité de l'axe de la Terre.
POLICE|Service qui fait respecter la loi.
POLICIER|Personne de la police.
POMME|Fruit rond du pommier.
POMPE|Appareil qui aspire ou refoule un liquide.
POMPIER|Personne qui éteint les feux.
PONT|Construction qui permet de traverser.
PORC|Cochon, ou sa viande.
PORTAIL|Grande porte d'un jardin.
PORTE|Ouverture pour entrer ou sortir.
PORTRAIT|Image d'une personne.
PORT|Lieu où s'abritent les bateaux.
POSITION|Endroit, manière de se tenir.
POSTE|Service du courrier, ou emploi.
POTAGER|Jardin de légumes.
POTE|Copain, en langage familier.
POTIRON|
POUCE|Gros doigt de la main.
POUF|Siège bas et rembourré.
POULAIN|Petit du cheval.
POULET|Jeune poule.
POULE|Femelle du coq.
POUMON|Organe de la respiration.
POUPEE|
POUPE|Arrière d'un bateau.
POUR|Mot qui marque le but.
POUSSETTE|Voiture d'enfant.
POUSSIERE|Fine poudre qui se dépose.
POUSSIN|Petit de la poule.
PRAIRIE|Terrain couvert d'herbe.
PREMIER|Qui vient avant tous les autres.
PRESENT|Le moment actuel, ou cadeau.
PRESSE|Journaux, ou machine.
PRINCESSE|Fille d'un roi.
PRINCE|Fils de roi.
PRINTEMPS|Saison des fleurs.
PRISON|Lieu où l'on enferme.
PRIX|Ce que coûte une chose, ou récompense.
PROBLEME|Question difficile à résoudre.
PROGRES|Avancée.
PROIE|Animal chassé par un autre.
PROJET|Ce que l'on prévoit de faire.
PROMENADE|Marche pour le plaisir.
PROVERBE|Phrase de sagesse populaire.
PRUDENCE|Attention au danger.
PRUNE|Petit fruit à noyau.
PUCE|Petit insecte sauteur, ou circuit électronique.
PUITS|Trou profond pour tirer de l'eau.
PULL|Vêtement de laine pour le haut du corps.
PUMA|Grand félin d'Amérique.
PURE|Sans mélange.
PUZZLE|Jeu de pièces à assembler.
PYRAMIDE|Monument à base carrée et sommet pointu.
QUAI|Bord aménagé le long de l'eau ou d'une voie.
QUARTIER|Partie d'une ville.
QUART|Une des quatre parties égales.
QUESTION|Demande pour savoir quelque chose.
QUILLE|Pièce de bois à renverser.
QUOI|Mot qui sert à demander une chose.
QUOTIDIEN|De tous les jours.
RACCOURCI|Chemin plus court.
RACINE|Partie de la plante sous la terre.
RADAR|Appareil qui détecte les objets à distance.
RADEAU|Plateforme flottante.
RADIATEUR|Appareil qui chauffe une pièce.
RADIO|Appareil qui capte les émissions.
RAGE|Grande colère, ou maladie grave.
RAID|Longue course, ou attaque rapide.
RAISIN|Fruit de la vigne.
RAMER|Faire avancer un bateau avec des rames.
RAME|Longue pièce de bois pour faire avancer un bateau.
RANDONNEE|Longue promenade à pied.
RANG|Ligne de personnes, ou position dans un classement.
RAPIDE|Qui va vite.
RAQUETTE|Instrument pour frapper une balle.
RARE|Que l'on voit peu souvent.
RASOIR|Instrument pour raser.
RAYON|Trait de lumière, ou étagère.
RECETTES|
RECETTE|Façon de préparer un plat.
RECIT|Histoire racontée.
RECOLTE|Action de cueillir les produits de la terre.
REFLET|Image renvoyée.
REFLEXION|Fait de penser avec soin.
REGARDER|Diriger les yeux vers.
REGARD|Action de regarder.
REGLE|Instrument pour tracer des traits, ou loi.
REINE|Femme du roi, ou souveraine.
REIN|Organe qui filtre le sang.
REMEDE|Médicament.
REMORQUE|Véhicule tiré par un autre.
RENARDEAU|Petit du renard.
RENARD|Animal roux à la queue touffue.
RENNE|
REPAS|Nourriture prise à heure fixe.
REPOS|Arrêt pour se détendre.
REQUETE|Demande.
REQUINS|
REQUIN|Grand poisson aux dents pointues.
RESEAU|Ensemble de lignes reliées.
RESPECT|Considération pour quelqu'un.
RESPIRER|Faire entrer et sortir l'air.
RESTE|Ce qui demeure.
RETARD|Arrivée après l'heure.
RETOUR|Action de revenir.
RETRAITE|Fin de la vie de travail.
REUSSITE|Succès.
REVEILLON|Repas de fête la nuit de Noël.
REVEIL|Fin du sommeil, ou horloge qui sonne.
REVER|Faire un rêve.
REVE|Images qui viennent pendant le sommeil.
RICHESSE|Grande quantité de biens.
RICHE|Qui a beaucoup d'argent.
RIDEAU|Tissu devant une fenêtre.
RIDE|Pli de la peau qui vient avec l'âge.
RIEN|Aucune chose.
RIGOLADE|Moment où l'on rit.
RIGOLO|Drôle.
RIRE|Montrer sa joie par des éclats de voix.
RIVAGE|Bord de la mer.
RIVAL|Adversaire.
RIVE|Bord d'une rivière ou d'un lac.
RIVIERE|Cours d'eau.
ROBE|Vêtement d'une seule pièce, des épaules aux jambes.
ROBINET|Appareil qui laisse couler l'eau.
ROBOT|Machine qui agit seule.
ROCHER|Grande pierre.
ROCHE|Pierre dure.
ROMAN|Long récit imaginaire.
RONCE|Arbuste épineux des mûres.
ROND|Qui a la forme d'un cercle.
RONRONNER|Faire le bruit du chat content.
ROSEAU|Plante à longue tige des bords de l'eau.
ROSE|Fleur parfumée à épines, ou couleur.
ROSSIGNOL|Oiseau au chant mélodieux.
ROUE|Objet circulaire qui tourne sur un axe.
ROUGE|Couleur du sang.
ROULEAU|Objet de forme cylindrique.
ROUTE|Voie pour les voitures.
ROUX|Couleur rouge orangé des cheveux.
ROYAUME|Pays gouverné par un roi.
RUBAN|Bande étroite de tissu.
RUCHE|Maison des abeilles.
RUDE|Dur, rugueux.
RUELLE|Petite rue.
RUISSEAU|Petit cours d'eau.
RUSE|Moyen habile pour tromper.
SABLE|Petits grains de roche des plages.
SABLIER|Instrument qui mesure le temps avec du sable.
SABRE|Grande épée courbe.
SAGE|Calme et raisonnable.
SAINT|Personne très pure ou vénérée.
SAIN|En bonne santé.
SAISON|Chacune des quatre parties de l'année.
SALADE|Plat de feuilles vertes.
SALE|Qui n'est pas propre.
SALLE|Grande pièce.
SALON|Pièce où l'on reçoit.
SALUT|Mot pour dire bonjour.
SAMEDI|Sixième jour de la semaine.
SANDALE|
SANDWICH|Pain garni.
SANG|Liquide rouge qui circule dans le corps.
SAPIN|Arbre toujours vert en forme de cône.
SAUCE|Liquide qui accompagne un plat.
SAUCISSE|Viande hachée dans un boyau.
SAULE|Arbre aux branches tombantes.
SAUMON|Poisson à chair rose.
SAUTE|Fait un bond.
SAUT|Action de s'élever du sol par un élan.
SAUVAGE|Qui vit en liberté dans la nature.
SAUVETAGE|Fait de sauver.
SAVANE|Grande plaine herbeuse d'Afrique.
SAVON|Produit pour se laver.
SAXOPHONE|Instrument à anche en métal.
SCENE|Lieu où jouent les acteurs.
SCIENCE|Ensemble de connaissances.
SCOOTER|
SCORPION|Animal à pinces et queue venimeuse.
SCULPTURE|Œuvre taillée dans la matière.
SEAU|Récipient avec une anse pour porter de l'eau.
SECHE|Sans eau.
SECONDE|Soixantième partie d'une minute.
SECRET|Ce que l'on cache.
SEIZE|Le nombre 16.
SELLE|Siège posé sur un cheval ou un vélo.
SEMAINE|Sept jours.
SENTIER|Petit chemin.
SEPT|Le nombre 7.
SERPENT|Reptile sans pattes.
SERRURE|Mécanisme qu'ouvre une clé.
SERVICE|Aide rendue.
SERVIETTE|Linge pour s'essuyer.
SEUL|Sans personne d'autre.
SIECLE|Période de cent ans.
SIFFLET|Petit instrument qui siffle.
SIGNAL|Signe qui avertit.
SIGNE|Geste ou marque qui veut dire quelque chose.
SILENCE|Absence de bruit.
SINGES|Animaux agiles des arbres.
SINGE|Animal agile qui vit dans les arbres.
SIRENE|
SIRE|Titre donné à un roi.
SIROP|Liquide sucré.
SITE|Lieu, ou ensemble de pages sur Internet.
SOCLE|Base d'une statue.
SOEUR|Fille née des mêmes parents.
SOIE|Tissu fin et brillant fait par un ver.
SOIF|Envie de boire.
SOIR|Fin de la journée.
SOLDAT|Membre d'une armée.
SOLDE|Prix réduit.
SOLEIL|Étoile qui éclaire la Terre.
SOLE|Poisson plat de mer.
SOLITUDE|État de celui qui est seul.
SOLO|Morceau joué par un seul musicien.
SOMMEIL|État de celui qui dort.
SOMMELIER|Spécialiste du vin au restaurant.
SOMMET|Point le plus haut.
SOMME|Total, ou petit sommeil.
SONDE|Instrument pour explorer.
SORCIERE|Femme qui jette des sorts.
SORCIER|Personne qui jette des sorts.
SORTE|Espèce, genre.
SORT|Destin, ou formule magique.
SOUCOUPE|Petite assiette sous une tasse.
SOUPE|Bouillon chaud.
SOUPIRAIL|Petite fenêtre de cave.
SOURD|Qui n'entend pas.
SOURICEAU|Petit de la souris.
SOURIRE|Expression joyeuse des lèvres.
SOURIS|Petit rongeur, ou appareil de l'ordinateur.
SOUSMARIN|
SOUS|Plus bas que, ou pièces de monnaie.
SOUVENIR|Ce qui reste dans la mémoire.
SPECTACLE|Ce qu'on présente à un public.
SPHINX|Monstre de légende qui pose des énigmes.
SPORT|Activité physique.
SQUELETTE|Ensemble des os.
STADE|Terrain de sport avec des tribunes.
STATION|Arrêt de transport, ou lieu de vacances.
STATUETTE|Petite statue.
STATUE|Sculpture qui représente un être.
STYLE|Manière personnelle.
STYLO|Instrument pour écrire à l'encre.
SUCETTE|
SUCRERIE|Bonbon.
SUCRES|Produits doux.
SUCRE|Produit doux et sucré.
SUIE|Poussière noire laissée par la fumée.
SUITE|Ce qui vient après.
SUPER|Formidable.
SUPPORTER|Encourager une équipe, ou endurer.
SURFACE|Partie extérieure.
SURPRISE|Ce qui étonne.
TABLEAU|Peinture, ou panneau de classe.
TABLETTE|Petite planche, ou plaque de chocolat.
TABLE|Meuble à plateau et pieds.
TABOURET|Siège sans dossier.
TACHE|Marque sale.
TAILLE|Hauteur, ou dimension.
TALENT|Don naturel.
TALON|Arrière du pied.
TAMBOURIN|Petit tambour.
TAMBOUR|Instrument de percussion.
TAMIS|Passoire fine.
TANGO|Danse d'Argentine.
TANTE|Sœur du père ou de la mère.
TAPE|Petit coup donné du plat de la main.
TAPIS|Tissu épais posé sur le sol.
TARD|Après le moment prévu.
TARTE|Pâte garnie de fruits, cuite au four.
TARTINE|Tranche de pain garnie.
TASSE|Petit récipient avec une anse.
TAUPE|Petit animal qui creuse des galeries.
TAUREAU|Mâle de la vache.
TAXE|Somme d'argent à payer à l'État.
TAXI|Voiture avec chauffeur qu'on paie au trajet.
TELEPHONE|Appareil pour parler à distance.
TELESCOPE|Instrument pour voir les étoiles.
TEMOIN|Personne qui a vu quelque chose.
TEMPETE|Vent très violent.
TEMPS|Durée, ou météo.
TENNIS|Sport de raquette avec un filet.
TENTATIVE|Essai.
TENTE|Abri de toile.
TERRAIN|Étendue de terre.
TERRASSE|Plateforme en plein air.
TERRE|Planète où nous vivons, ou sol.
TETE|Partie du corps qui porte le visage.
TEXTE|Ensemble de mots écrits.
THEATRE|Lieu où l'on joue des pièces.
THEME|Sujet.
THON|Gros poisson de mer.
TIGE|Partie de la plante qui porte les feuilles.
TIGRE|Grand félin rayé.
TIMBRE|Petite vignette collée sur une lettre.
TIPI|Tente conique des Amérindiens.
TIRELIRE|Boîte pour garder ses pièces.
TIROIRS|
TIROIR|Petite caisse qui glisse dans un meuble.
TITRE|Nom d'un livre ou d'un film.
TOBOGGAN|Piste glissante pour jouer.
TOGE|Grande robe des Romains.
TOILE|Tissu, ou tableau.
TOIT|Couverture qui protège le haut d'une maison.
TOMATE|Fruit rouge qu'on mange en salade.
TOMBE|Lieu où l'on enterre un mort.
TONNERRE|Bruit qui suit l'éclair.
TORCHE|Lampe qu'on tient à la main.
TORE|Forme d'anneau, comme une bouée.
TORNADE|Tourbillon de vent violent.
TORSE|Haut du corps.
TORTUE|Reptile à carapace.
TOTAL|Somme complète.
TOUCHE|Bouton d'un clavier.
TOUJOURS|Tout le temps.
TOUPIE|
TOURISTE|Personne qui voyage pour le plaisir.
TOURNESOL|Grande fleur jaune qui suit le soleil.
TOURNOI|Compétition en plusieurs matchs.
TOUR|Construction haute, ou mouvement circulaire.
TOUT|L'ensemble, sans rien laisser.
TOUX|Expulsion brusque d'air par la gorge.
TRACE|Marque laissée.
TRACTEUR|Engin agricole puissant.
TRAINEAU|Véhicule à patins qui glisse sur la neige.
TRAIN|Suite de wagons tirés par une locomotive.
TRAIT|Ligne.
TRAJET|Chemin d'un point à un autre.
TRAVAIL|Activité pour produire.
TRAVERSER|Passer d'un côté à l'autre.
TREMPLIN|Planche qui aide à sauter.
TRESORIER|Personne qui garde l'argent d'un groupe.
TRESORS|
TRESOR|Richesses cachées.
TRESSE|Cheveux entrelacés.
TRES|Beaucoup, à un haut degré.
TRIANGLE|Figure à trois côtés.
TRIBU|Groupe de familles.
TRICOTER|Faire un vêtement avec des aiguilles et de la laine.
TRICYCLE|Vélo à trois roues.
TRIO|Groupe de trois.
TRISTE|Malheureux.
TROIS|Le nombre 3.
TROMPETTE|Instrument de musique en cuivre.
TROMPE|Long nez de l'éléphant.
TRONC|Partie principale d'un arbre.
TROTTOIR|Chemin pour piétons le long de la rue.
TROUPEAU|Groupe d'animaux.
TROUPE|Groupe de soldats ou d'artistes.
TROU|Ouverture, creux.
TRUITE|Poisson de rivière.
TUBE|Cylindre creux, ou chanson à succès.
TUILE|Plaque qui couvre un toit.
TULIPE|Fleur en forme de coupe.
TUNNEL|Galerie sous terre.
TUTU|Jupe de danseuse étoile.
UNIFORME|Vêtement pareil pour tout un groupe.
UNION|Réunion en un seul tout.
UNIVERSEL|Qui concerne tout le monde.
UNIVERS|Tout ce qui existe.
URNE|Boîte où l'on dépose les bulletins de vote.
USINE|Lieu où l'on fabrique des produits.
UTILE|Qui sert à quelque chose.
VACANCES|Période de repos.
VACHE|Animal de la ferme qui donne du lait.
VAGABOND|Personne sans domicile qui erre.
VAGUE|Ondulation de la mer.
VAINQUEUR|Celui qui gagne.
VAISSEAU|Grand navire, ou engin spatial.
VALISE|Bagage à poignée.
VALLEE|Creux entre les montagnes.
VALSE|Danse à trois temps.
VAMPIRE|Mort qui boit le sang des vivants.
VAPEUR|Eau sous forme de gaz.
VASE|Récipient pour les fleurs, ou boue au fond de l'eau.
VEAU|Petit de la vache.
VEGETAL|Plante.
VEINE|Vaisseau du sang, ou chance.
VELOURS|Tissu doux et ras.
VELO|Véhicule à deux roues et à pédales.
VENDEUR|Personne qui vend.
VENDREDI|Cinquième jour de la semaine.
VENIR|Se déplacer vers ici.
VENTRE|Partie du corps sous la poitrine.
VENT|Air qui se déplace.
VERGER|Terrain planté d'arbres fruitiers.
VERITABLE|Vrai.
VERRE|Matière transparente, ou récipient pour boire.
VERS|Ligne d'un poème, ou en direction de.
VERTICAL|Droit de haut en bas.
VERT|Couleur de l'herbe.
VESTE|Vêtement court à manches.
VETEMENT|Ce que l'on porte sur soi.
VIDEO|Film enregistré.
VIDE|Qui ne contient rien.
VIEUX|Âgé.
VIGNE|Plante qui donne le raisin.
VILLAGE|Petite agglomération à la campagne.
VILLE|Grande agglomération.
VINAIGRE|Liquide acide pour assaisonner.
VIOLETTE|
VIOLET|Couleur entre le bleu et le rouge.
VIOLON|Instrument à cordes et à archet.
VIRUS|Microbe qui rend malade.
VISAGE|Devant de la tête.
VISITE|Action d'aller voir.
VITESSE|Rapidité.
VITE|Rapidement.
VITRE|Plaque de verre d'une fenêtre.
VIVRE|Être en vie.
VOIE|Chemin, route.
VOILE|Grande toile d'un bateau, ou tissu léger.
VOISIN|Personne qui habite à côté.
VOITURE|Véhicule à quatre roues.
VOIX|Son produit par la bouche quand on parle.
VOLCAN|Montagne qui crache de la lave.
VOLEUR|Personne qui vole.
VOTRE|Qui est à vous.
VOYAGEUR|Personne qui voyage.
VOYAGEUSE|Femme qui voyage.
VOYAGE|Déplacement lointain.
VRAI|Conforme à la réalité.
WAGON|Voiture d'un train.
XYLOPHONE|Instrument à lames de bois.
YEUX|Les deux organes de la vue.
ZEBRE|Cheval rayé noir et blanc.
ZEBU|Bœuf à bosse d'Asie et d'Afrique.
ZERO|Le nombre 0.
ZOMBIE|Mort-vivant des films.
ZONE|Espace délimité.
ZOOLOGIE|Science des animaux.`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}



export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const sprite = (g, rows, x, y, pal) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } });
  const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };
  const gameText = (g, w, lines, y0) => {  // lignes centrées en police pixel, sur une bande sombre
    g.fillStyle = 'rgba(11,3,28,.78)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
    lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
  };
  const theme = (acc, accL, accS, accD, acc2, base = ['#0c0a12', '#16121e', '#221c2c', '#2e263a', '#3a3046', '#62566e']) => {
    const [k, k2, fill, fillOn, hl, line] = base;
    return { k, k2, fill, fillOn, hl, line, acc, accL, accS, accD, rivet: '#f0f0f8', btn: hl, btnHi: line, btnLo: k2, btnHov: '#443852', btnHovHi: '#82768e', text: '#f4f0f8', muted: '#c0b8cc',
      acc2, gold: '#ffd84a', orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a', bg: '#100c16', bgDot: fill, bgDot2: k2, spark: accD, spark2: acc,
      tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................', '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] };
  };
  let ac = null, mute = false;
  const beep = (f, d, type = 'square', slide = 0, vol = .03, at = 0) => { if (mute) return; try { ac ??= new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + at; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d); } catch {} };
  const on = () => view.classList.contains('on');
  // la manette : croix et stick gauche = flèches, A = Entrée, B = Échap, X = Retour arrière, Y = H, Start = P ; envoyées comme des touches du clavier
  const padKeys = (map = {}) => {
    const KEY = { 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight', 0: 'Enter', 1: 'Escape', 2: 'Backspace', 3: 'h', 9: 'p', ...map };
    const held = new Map(), send = (k, type) => document.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));
    const loop = () => {
      requestAnimationFrame(loop);
      if (!on() || !navigator.getGamepads) return;
      const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
      const now = performance.now(), down = new Set();
      for (const [i, k] of Object.entries(KEY)) if (p.buttons[i]?.pressed) down.add(k);
      const [ax = 0, ay = 0] = p.axes;
      if (ax < -.5) down.add('ArrowLeft'); if (ax > .5) down.add('ArrowRight'); if (ay < -.5) down.add('ArrowUp'); if (ay > .5) down.add('ArrowDown');
      for (const k of down) { const t = held.get(k); if (t === undefined) { held.set(k, now + 260); send(k, 'keydown'); } else if (/^Arrow/.test(k) && now > t) { held.set(k, now + 110); send(k, 'keydown'); } }
      for (const k of [...held.keys()]) if (!down.has(k)) { held.delete(k); send(k, 'keyup'); }
    };
    requestAnimationFrame(loop);
  };
  pxSkin(view.querySelector('.appWrap'), { title: 'ANAGRAMMES', T: theme('#ff9a4a', '#ffe0c0', '#c0602a', '#2a1408', '#7ee07a'),
    emblem: ['............', 'kkkk.kkkk...', 'kwak.kwbk...', 'kkkk.kkkk...', '............', '...kkkk.kkkk', '...kbwk.kawk', '...kkkk.kkkk', '............', 'kkkk.kkkk...', 'kawk.kwbk...', 'kkkk.kkkk...'],
    icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const DEF = new Map(DICO.split('\n').map(l => l.split('|'))), DICT = new Set(DEF.keys()), WORDS = [...DEF].filter(([, d]) => d).map(([w]) => w);
  const W = 240, H = 136, PER = 5, BONUS = 25, SHOW = 150;
  const save = { level: 1, best: 0, words: 0, games: 0, stars: {}, ...(await doc('records')) };
  const keep = () => folder.write('records', save).catch(() => {});
  const sorted = w => [...w].sort().join('');
  const lenFor = lvl => Math.min(9, 4 + Math.floor((lvl - 1) / 2));
  const shuffle = (w, r = Math.random) => { const a = [...w]; for (let t = 0; t < 20; t++) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } if (a.join('') !== w) break; } return a; };
  const wrap = (s, n = 40) => s.split(' ').reduce((L, w) => { const l = L[L.length - 1]; if (l && (l + ' ' + w).length <= n) L[L.length - 1] = l + ' ' + w; else L.push(w); return L; }, []);
  // 3 étoiles : aucun indice et moins de 40 % du temps ; 2 : au plus 2 indices et moins de 70 %
  const starsOf = done => { const h = done.reduce((a, d) => a + d.h, 0), r = done.reduce((a, d) => a + d.u, 0) / done.reduce((a, d) => a + d.a, 0); return !h && r <= .4 ? 3 : h <= 2 && r <= .7 ? 2 : 1; };
  let g = null, st = null;
  const pickWords = lvl => { const n = lenFor(lvl), pool = WORDS.filter(w => w.length === n), used = new Set(), out = []; while (out.length < PER && out.length < pool.length) { const w = pool[Math.floor(Math.random() * pool.length)]; if (!used.has(w)) { used.add(w); out.push(w); } } return out; };
  const allowed = w => 60 * (30 + w.length * 6);
  const newWord = () => { const w = st.list[st.i]; Object.assign(st, { word: w, tiles: shuffle(w).map(c => ({ c, used: false, at: 0 })), slots: [], hinted: 0, t: allowed(w), cur: 0, fx: 0 }); };
  const start = (lvl, score = 0) => { st = { lvl, list: pickWords(lvl), i: 0, score, mode: 'ready', tick: 0, msg: '', msgT: 0, combo: 0, done: [], ft: 0 }; newWord(); found(); };
  const typed = () => st.slots.map(i => st.tiles[i].c).join('');
  function put(i) { if (st.mode !== 'play' || i == null || i < 0 || st.tiles[i].used) return; st.tiles[i].used = true; st.tiles[i].at = st.tick; st.slots.push(i); beep(520 + st.slots.length * 40, .05); if (st.slots.length === st.word.length) check(); }
  function back() { if (st.mode !== 'play' || st.slots.length <= st.hinted) return; st.tiles[st.slots.pop()].used = false; beep(300, .04); }
  function check() {
    const w = typed();
    if (w === st.word || (DICT.has(w) && sorted(w) === sorted(st.word))) {
      const u = allowed(st.word) - st.t, alt = w === st.word ? '' : w;
      st.combo = !st.hinted && u <= 60 * (3 + st.word.length) ? st.combo + 1 : 0;
      const mult = Math.max(1, Math.min(3, st.combo)), pts = Math.max(5, 10 * st.word.length + Math.floor(st.t / 60) - st.hinted * 15) * mult + (alt ? BONUS : 0);
      st.score += pts; save.words++; st.i++;
      st.done.push({ w: st.word, alt, u, a: allowed(st.word), h: st.hinted, pts });
      st.msg = alt ? 'AUTRE MOT ! +' + BONUS : 'Bravo !'; st.mode = 'found'; st.ft = 0;
      [660, 880, 1100, ...(alt ? [1320, 1560] : [])].forEach((f, k) => beep(f, .1, 'square', 0, .03, k * .07));
      if (mult > 1) beep(1760, .15, 'triangle', 0, .03, .3);
      found();
    } else { st.fx = 24; st.msg = 'Pas tout à fait…'; st.msgT = 60; beep(160, .2, 'sawtooth', 90); while (st.slots.length > st.hinted) st.tiles[st.slots.pop()].used = false; }
  }
  function skip() { if (st.mode !== 'found') return; if (st.i >= st.list.length) return levelDone(); st.mode = 'play'; newWord(); }
  function hint() {  // la lettre suivante, à sa place
    if (st.mode !== 'play') return;
    while (st.slots.length > st.hinted) st.tiles[st.slots.pop()].used = false;
    const c = st.word[st.hinted], i = st.tiles.findIndex(t => !t.used && t.c === c);
    st.hinted++; put(i); beep(440, .08, 'triangle');
  }
  function levelDone() {
    st.mode = 'level'; st.dead = 0; st.stars = starsOf(st.done);
    if (st.stars > (save.stars[st.lvl] || 0)) save.stars = { ...save.stars, [st.lvl]: st.stars };
    if (st.lvl + 1 > save.level) save.level = st.lvl + 1; if (st.score > save.best) save.best = st.score; keep(); info();
    for (let k = 0; k < st.stars; k++) beep(880 + k * 220, .12, 'square', 0, .03, .3 + k * .25);
  }
  function lose() { st.mode = 'over'; st.dead = 0; save.games++; st.newBest = st.score > save.best; if (st.newBest) save.best = st.score; keep(); info(); beep(200, .4, 'sawtooth', 70); }
  function update() {
    st.tick++; if (st.fx) st.fx--; if (st.msgT) st.msgT--;
    if (st.mode === 'over' || st.mode === 'level') { st.dead++; return; }
    if (st.mode === 'found' && ++st.ft >= SHOW) skip();
    if (st.mode === 'play' && --st.t <= 0) lose();
  }
  const tileAt = (i, n) => { const s = n > 7 ? 22 : 26; return [W / 2 - (n * s) / 2 + i * s + 2, 92, s - 4]; };
  const slotAt = (i, n) => { const s = n > 7 ? 22 : 26; return [W / 2 - (n * s) / 2 + i * s + 2, 44, s - 4]; };
  function tile(x, y, s, c, col, dark) { px(g, '#140a04', x, y + 2, s, s); px(g, dark, x, y, s, s); px(g, col, x + 1, y + 1, s - 2, s - 3); px(g, '#ffffff', x + 2, y + 2, s - 6, 1); pxFont(g, c, x + s / 2, y + s / 2 + 5, '#2a1408', 8, 'center'); }
  const STAR = ['...#...', '..#o#..', '##ooo##', '#ooooo#', '.#ooo#.', '#oo#oo#', '##...##'];
  const star = (x, y, lit) => sprite(g, STAR, x, y, { '#': lit ? '#2a1408' : '#3a2a40', o: lit ? '#ffd84a' : '#22162a' });
  function draw() {
    g.imageSmoothingEnabled = false;
    px(g, '#1a1020', 0, 0, W, H);
    for (let y = 18; y < H; y += 6) px(g, '#22162a', 0, y, W, 1);
    px(g, '#0a0610', 0, 0, W, 15);
    pxFont(g, 'Niveau ' + st.lvl, 4, 11, '#ffffff');
    for (let i = 0; i < PER; i++) px(g, i < st.i ? '#ff9a4a' : '#3a2a40', 100 + i * 8, 5, 6, 6);
    if (st.combo > 1) pxFont(g, '×' + Math.min(3, st.combo), 144, 11, st.tick % 20 < 10 ? '#ff9a4a' : '#ffd84a');
    pxFont(g, String(st.score), W - 4, 11, '#ffd84a', 8, 'right');
    const n = st.word.length, sec = Math.ceil(st.t / 60);
    if (st.mode === 'play' || st.mode === 'pause') {
      pxFont(g, sec + ' s', W / 2, 30, sec <= 10 ? '#ff4a3a' : '#c0b8cc', 8, 'center');
      const shake = st.fx ? Math.round(Math.sin(st.fx) * 2) : 0;
      for (let i = 0; i < n; i++) { const [x, y, s] = slotAt(i, n); px(g, '#0a0610', x + shake, y, s, s); px(g, '#2a1e30', x + 1 + shake, y + 1, s - 2, s - 2); }
      st.tiles.forEach((t, i) => { const [x, y, s] = tileAt(i, n); if (t.used) { px(g, '#2a1e30', x, y, s, s); return; } tile(x, y, s, t.c, '#ffd8a8', '#c0602a'); if (i === st.cur) { px(g, '#ffffff', x - 2, y + s + 4, s + 4, 2); } });
      st.slots.forEach((ti, i) => {  // la tuile vole de sa place jusqu'à sa case
        const [x0, y0] = tileAt(ti, n), [x1, y1, s] = slotAt(i, n), k = Math.min(1, (st.tick - st.tiles[ti].at) / 8), e = 1 - (1 - k) ** 3;
        tile(x0 + (x1 - x0) * e + shake, y0 + (y1 - y0) * e - Math.round(Math.sin(k * Math.PI) * 8), s, st.tiles[ti].c, i < st.hinted ? '#7ee07a' : '#ffd8a8', '#c0602a');
      });
      if (st.msgT) pxFont(g, st.msg, W / 2, 128, '#ff8a3a', 8, 'center');
    }
    if (st.mode === 'found') {
      const d = st.done[st.done.length - 1], word = d.alt || d.w, def = DEF.get(d.w) || '';
      pxFont(g, st.msg, W / 2, 32, d.alt ? '#ff9a4a' : '#7ee07a', d.alt ? 12 : 8, 'center');
      [...word].forEach((c, i) => { const [x, y, s] = slotAt(i, n), b = Math.round(Math.max(0, Math.sin(st.ft * .25 - i * .6)) * (st.ft < 40 ? 4 : 0));
        px(g, '#ffd84a', x - 1, y - 1 - b, s + 2, s + 2); tile(x, y - b, s, c, st.ft < 8 ? '#ffffff' : '#ffe48a', '#c08a2a'); });
      wrap((d.alt ? d.w + ' : ' : '') + def).slice(0, 3).forEach((l, k) => pxFont(g, l, W / 2, 84 + k * 12, '#e8e0f0', 8, 'center'));
      pxFont(g, '+' + d.pts + (st.combo > 1 ? '  COMBO ×' + Math.min(3, st.combo) : ''), W / 2, 126, '#ffd84a', 8, 'center');
    }
    if (st.mode === 'ready') gameText(g, W, [['ANAGRAMMES · NIVEAU ' + st.lvl, '#ff9a4a', 12], [PER + ' mots de ' + n + ' lettres', '#ffffff'], ['Tape les lettres dans l’ordre', '#b8d0ff'], ['Espace : mélanger · Tab : indice', '#b8b0c8'], ['Entrée : commencer', '#b8b0c8']], 40);
    if (st.mode === 'pause') gameText(g, W, [['PAUSE', '#ff9a4a', 12], ['Entrée : reprendre', '#b8b0c8']], 60);
    if (st.mode === 'level') {  // le bilan : les 5 mots, le temps de chacun, les indices, les étoiles
      g.fillStyle = 'rgba(11,3,28,.9)'; g.fillRect(0, 15, W, H - 15);
      pxFont(g, 'NIVEAU ' + st.lvl + ' FINI !', W / 2, 30, '#7ee07a', 12, 'center');
      for (let k = 0; k < 3; k++) { const show = st.dead > 20 + k * 15; star(W / 2 - 16 + k * 12, 36, show && k < st.stars); }
      st.done.forEach((d, k) => { const y = 56 + k * 11, vis = st.dead > 10 + k * 6; if (!vis) return;
        pxFont(g, d.w + (d.alt ? ' (' + d.alt + ')' : ''), 16, y, '#ffffff');
        pxFont(g, Math.round(d.u / 60) + ' s', 150, y, '#c0b8cc', 8, 'right');
        pxFont(g, d.h ? d.h + ' ind.' : '—', 192, y, d.h ? '#ff8a3a' : '#7ee07a', 8, 'right');
        pxFont(g, '+' + d.pts, W - 12, y, '#ffd84a', 8, 'right'); });
      pxFont(g, st.score + ' points', W / 2, 116, '#ffd84a', 8, 'center');
      if (st.dead > 40) pxFont(g, 'Entrée : niveau suivant', W / 2, 129, '#b8b0c8', 8, 'center');
    }
    if (st.mode === 'over' && st.dead > 20) gameText(g, W, [['TEMPS ÉCOULÉ', '#ff4a3a', 12], ['Le mot était ' + st.word, '#ffffff'], [wrap(DEF.get(st.word) || '')[0] || '', '#c0b8cc'], [st.score + ' points' + (st.newBest ? ' · record !' : ''), '#ffd84a'], [st.dead > 40 ? 'Entrée : rejouer ce niveau' : '', '#b8b0c8']], 38);
    if (st.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Anagrammes, niveau ' + st.lvl + ', mot ' + Math.min(PER, st.i + 1) + ' sur ' + PER + ' : lettres ' + st.tiles.map(t => t.c).join(' ') + ', placées : ' + (typed() || 'aucune') + ', ' + sec + ' secondes'
      + (st.mode === 'found' ? ', mot trouvé : ' + st.done[st.done.length - 1].w : st.mode === 'level' ? ', niveau fini, ' + st.stars + ' étoiles' : st.mode === 'over' ? ', temps écoulé' : '') + '.');
  }
  function info() {
    const stars = Object.values(save.stars || {}).reduce((a, b) => a + b, 0);
    $('anStats').replaceChildren(...[['Niveau atteint', save.level], ['Meilleur score', save.best], ['Étoiles', stars], ['Mots trouvés', save.words], ['Parties', save.games]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
  }
  function found() {  // la colonne des mots trouvés du niveau, avec leur définition
    const box = $('anFound'); if (!box) return;
    box.replaceChildren(...(st.done.length ? st.done.map(d => { const r = el('div', 'anW'); r.append(el('b', '', d.w + (d.alt ? ' · ' + d.alt : '')), el('span', '', DEF.get(d.w) || '')); return r; }) : [el('span', 'hint', 'Les mots trouvés s’affichent ici, avec leur définition.')]));
  }
  document.addEventListener('keydown', e => {
    if (!on() || !st || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key;
    if (st.mode === 'level') { if (k === 'Enter' && st.dead > 40) { e.preventDefault(); start(st.lvl + 1, st.score); } return; }
    if (st.mode === 'over') { if (k === 'Enter' && st.dead > 40) { e.preventDefault(); start(st.lvl); } return; }
    const L = k.length === 1 ? k.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase() : '';
    if (st.mode === 'found') { if (k === 'Tab' || k === ' ' || k === 'Enter') e.preventDefault(); if (k.length === 1 || /^(Tab|Enter)$/.test(k)) { skip(); if (!/^[A-Z]$/.test(L)) return; } else return; }  // une lettre passe au mot suivant et se pose
    if (k === 'Escape') { if (st.mode === 'play') st.mode = 'pause'; else if (st.mode === 'pause') st.mode = 'play'; return; }
    if (st.mode !== 'play') { if (k === 'Enter' || k === ' ') { e.preventDefault(); st.mode = 'play'; } return; }
    if (k === 'Tab' || k === '?') { e.preventDefault(); hint(); return; }  // pas H : c'est une lettre des mots
    if (/^[A-Z]$/.test(L)) { put(st.tiles.findIndex(t => !t.used && t.c === L)); return; }
    if (k === 'Backspace') { back(); return; }
    if (k === ' ') { e.preventDefault(); const free = st.tiles.filter(t => !t.used), mixed = shuffle(free.map(t => t.c).join('')); free.forEach((t, i) => t.c = mixed[i]); return; }
    const mv = { ArrowLeft: -1, ArrowRight: 1 }[k], n = st.tiles.length;
    if (mv) { e.preventDefault(); st.cur = (st.cur + mv + n) % n; return; }
    if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); return; }
    if (k === 'Enter') { e.preventDefault(); put(st.cur); }
  });
  const cv = $('anCanvas');
  { const at = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) / b.width * W, (e.clientY - b.top) / b.height * H]; };
    cv.onpointerdown = e => { e.preventDefault(); if (!st) return;
      if (st.mode === 'level') { if (st.dead > 40) start(st.lvl + 1, st.score); return; }
      if (st.mode === 'over') { if (st.dead > 40) start(st.lvl); return; }
      if (st.mode === 'found') return skip();
      if (st.mode !== 'play') { st.mode = 'play'; return; }
      const [x, y] = at(e), n = st.word.length;
      for (let i = 0; i < n; i++) { const [tx, ty, s] = tileAt(i, n); if (x >= tx && x < tx + s && y >= ty && y < ty + s) { st.cur = i; return put(i); } }
      for (let i = 0; i < n; i++) { const [sx, sy, s] = slotAt(i, n); if (x >= sx && x < sx + s && y >= sy && y < sy + s) return back(); }
    };
  }
  $('anNew').onclick = () => { start(save.level > 1 ? save.level : 1); $('anNew').blur(); };
  $('anFs').onclick = () => { $('anFs').blur(); if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); };
  padKeys({ 3: 'Tab', 5: ' ', 9: 'Escape' });
  {  // vérification : mots et définitions, mélange jamais égal au mot, mot juste, autre mot (+ bonus), faux mot, combo, indices, bilan et étoiles
    const bad = [], keepS = JSON.stringify(save), type = s => { for (const c of s) put(st.tiles.findIndex(t => !t.used && t.c === c)); }; mute = true;
    for (let n = 4; n <= 9; n++) if (WORDS.filter(w => w.length === n).length < 150) bad.push(n + ' lettres : trop peu de mots');
    if ([...DICT].some(w => !/^[A-Z]{4,9}$/.test(w))) bad.push('mot interdit');
    for (const w of WORDS) if (shuffle(w).join('') === w && new Set(w).size > 1) bad.push('mélange raté : ' + w);
    start(1); st.mode = 'play'; type(st.word);
    if (st.i !== 1 || st.mode !== 'found' || st.combo !== 1) bad.push('mot juste refusé'); skip();
    st.list[1] = 'CHIEN'; newWord(); type('NICHE'); const d = st.done[1];
    if (st.i !== 2 || d?.alt !== 'NICHE' || st.combo !== 2 || d.pts < 2 * 50 + BONUS) bad.push('NICHE pour CHIEN : pas de bonus ou de combo'); skip();
    st.list[2] = 'LOUP'; newWord(); type('POUL'); if (st.i !== 2 || st.slots.length || st.mode !== 'play') bad.push('faux mot accepté');
    for (let k = 0; k < 4; k++) hint(); if (st.i !== 3 || st.combo) bad.push('indices ne finissent pas le mot');
    for (let w = 3; w < PER; w++) { skip(); for (let k = 0; k < st.word.length; k++) hint(); } skip();
    if (st.mode !== 'level' || st.done.length !== PER || st.stars !== 1) bad.push('bilan raté');
    if (starsOf([{ h: 0, u: 10, a: 100 }]) !== 3 || starsOf([{ h: 1, u: 50, a: 100 }]) !== 2) bad.push('étoiles fausses');
    console.assert(!bad.length, 'anagrammes', bad); view.dataset.selfcheck = bad.join(' | ') || 'ok';
    Object.keys(save).forEach(k => delete save[k]); Object.assign(save, JSON.parse(keepS)); mute = false;
  }
  cv.__an = () => st;  // pour le test
  start(save.level);
  const STEP = 1000 / 60; let acc = 0, last = performance.now(), raf = 0;
  const frame = t => { if (!on()) { raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; } raf = requestAnimationFrame(frame); acc += Math.min(200, t - last); last = t; while (acc >= STEP) { update(); acc -= STEP; } draw(); };
  ctx.onOpen(() => { g ??= $('anCanvas').getContext('2d'); info(); last = performance.now(); if (!raf) raf = requestAnimationFrame(frame); });
}
