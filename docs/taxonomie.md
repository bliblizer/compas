# Taxonomie

## Principe : un graphe, pas un arbre

Un classement en arbre (une famille, puis des sous-courants) ne tient pas. Beaucoup de courants ont plusieurs parents : l'écosocialisme vient de l'écologie et du marxisme, l'anarcho-capitalisme du libéralisme et de l'anarchisme, la démocratie chrétienne du conservatisme et du catholicisme social.

Certaines idéologies sont par ailleurs **fines** au sens de Michael Freeden (*thin-centred*) : populisme, nationalisme, une partie du féminisme. Elles ne répondent pas à toutes les questions politiques et se greffent sur une idéologie **épaisse**. Le nationalisme existe à gauche (anticolonial), au centre (civique) et à droite (ethnique).

Le modèle a donc trois couches :

1. **La famille-racine** (`famille`), définie par la question ou la valeur pivot à laquelle le courant répond en premier. Un courant a une famille principale et peut avoir des **lignées secondaires** (`lignees`).
2. **Les modules transversaux** (`modules`) : nationalisme, populisme, religiosité, technophilie, souverainisme… Ils se combinent avec n'importe quelle famille.
3. **La position doctrinale** : les notes sur les dix grilles, indépendantes de la famille (voir `grilles.md`).

## Les 14 familles-racines

Source de vérité : `data/familles.json` (identifiants, couleurs, ordre).

| Famille | Valeur ou question pivot | Exemples de courants |
|---|---|---|
| Libéralismes | Liberté individuelle, limitation du pouvoir | Libéralisme classique, minarchisme, ordolibéralisme, social-libéralisme, néolibéralisme, libertarianisme, géorgisme |
| Républicanismes | Liberté comme non-domination, vertu civique | Jacobinisme, radicalisme, néo-républicanisme (Pettit), laïcisme |
| Socialismes | Égalité, propriété sociale | Socialisme utopique, social-démocratie, socialisme démocratique, coopératisme, distributisme |
| Marxismes | Lutte des classes, matérialisme historique | Léninisme, trotskysme, maoïsme, conseillisme, eurocommunisme, posadisme |
| Anarchismes | Abolition de la domination et de l'État | Mutuellisme, anarcho-syndicalisme, anarcho-communisme, communalisme, anarcho-capitalisme |
| Conservatismes | Continuité, ordre, transmission | Conservatisme burkéen, conservatisme libéral, démocratie chrétienne, corporatisme, gaullisme, paléoconservatisme |
| Traditionalismes et réaction | Retour à un ordre perdu | Contre-révolution, maurrassisme, traditionalisme intégral, archéofuturisme, néoréaction (Lumières sombres) |
| Fascismes | Renaissance nationale par la mobilisation totale | Fascisme italien, nazisme, phalangisme, néofascisme |
| Autoritarismes non fascistes | L'ordre par un pouvoir fort | Absolutisme, bonapartisme, caudillisme, développementalisme autoritaire |
| Écologismes | Rapport au vivant et aux limites | Environnementalisme, écologie politique, écosocialisme, décroissance, écologie profonde, écofascisme |
| Émancipations | Égalité face à une domination spécifique | Féminismes (libéral, radical, marxiste, intersectionnel), antiracisme, politiques LGBT+, décolonialisme |
| Anticolonialismes et tiers-mondismes | Souveraineté des peuples dominés | Panafricanisme, nassérisme, baasisme, bolivarisme, non-alignement |
| Politiques religieuses | La norme politique dérivée du sacré | Islamisme, théologie de la libération, intégralisme catholique, Hindutva, théocratie |
| Technopolitiques | La technique comme moteur ou solution | Technocratie, transhumanisme, accélérationnisme, néocaméralisme |

Changements par rapport au premier sommaire de l'encyclopédie :

- marxismes et socialismes sont séparés (deux méthodes ; la social-démocratie s'est construite contre le léninisme) ;
- quatre familles ajoutées : républicanismes, émancipations, anticolonialismes, autoritarismes non fascistes ;
- nationalismes et populismes deviennent des modules ;
- l'ancienne famille « syncrétismes » disparaît : les synthèses sont représentées par les lignées multiples et les relations de type `synthese`.

## Les modules transversaux

Source de vérité : `data/modules.json`. Liste de départ : nationalisme, populisme, religiosité, technophilie, souverainisme. À compléter.

## Niveaux de granularité

| Niveau | Contenu | Volume visé |
|---|---|---|
| Famille | Les 14 familles-racines | 14 |
| Courant | Une doctrine identifiable, avec une fiche | 80 à 120 |
| Variante | École ou tendance interne d'un courant | Plusieurs centaines, plus tard |
| Incarnation | Penseur, mouvement, parti, régime | Objets distincts des courants |

**Une idée n'est pas une incarnation.** Un parti mélange plusieurs courants et agit sous contraintes : il ne se confond jamais avec une idéologie. Cette séparation est indispensable pour l'Observatoire.

## Critère d'inclusion d'un courant

Un courant entre dans l'Atlas s'il réunit les trois conditions :

1. un corpus doctrinal identifiable ;
2. au moins un penseur ou un texte de référence ;
3. une désignation stable, revendiquée ou académique.

Ce critère est publié sur la page Méthode. Il protège des micro-étiquettes d'Internet.

## Viser l'exhaustivité : la saturation

Partir des manuels de référence (Andrew Heywood, *Political Ideologies* ; les travaux de Michael Freeden ; les dictionnaires de philosophie politique), puis croiser avec des listes encyclopédiques. Le corpus est considéré comme complet quand une nouvelle source n'ajoute plus de courant qui passe le critère d'inclusion.

## Relations entre courants

Source de vérité : `data/relations.json`. Chaque relation est orientée (source vers cible), typée et datable :

| Type | Sens | Rendu dans la généalogie |
|---|---|---|
| `derive` | La cible descend de la source | Trait plein |
| `synthese` | La cible combine la source avec une autre lignée | Trait pointillé |
| `rupture` | La cible se construit contre la source | À définir |
| `opposition` | Antagonisme doctrinal sans filiation | Non affiché dans la frise, utilisé dans les fiches |

## Catalogue de départ

`data/seed/courants-catalogue.json` contient 73 courants issus des maquettes et des courants cités par Alexandre (dont minarchisme, corporatisme, absolutisme, théocratie, archéofuturisme, néoréaction / Lumières sombres, néocaméralisme). Chaque entrée porte une famille, des lignées et une date d'émergence indicative **à vérifier**.

## Questions ouvertes

- Politiques religieuses : famille, module, ou les deux selon les courants (l'islamisme ou l'intégralisme sont épais ; la religiosité de la démocratie chrétienne est un module) ?
- Classement du corporatisme (conservatismes, avec lignée fascismes) et de l'anarcho-capitalisme (anarchismes, avec lignée libéralismes) : à confirmer.
- Choix des ~15 courants du MVP (voir `roadmap.md`).
